import Phaser from 'phaser'
import { Boss } from '../entities/Boss'
import { Bullet } from '../entities/Bullet'
import { Enemy } from '../entities/Enemy'
import { ExplosionEffect } from '../entities/ExplosionEffect'
import { PlayerShip } from '../entities/PlayerShip'
import { DESIGN_HEIGHT, DESIGN_WIDTH, ENEMY_BULLET_TTL_MS, INVINCIBLE_MS, MAX_ENEMIES, MAX_ENEMY_BULLETS, MAX_PLAYER_BULLETS, PLAYER_BULLET_TTL_MS, PLAYER_SPAWN_OFFSET_Y } from '../game/constants'
import { RunContext } from '../game/RunContext'
import { ENEMY_TYPES } from '../data/enemyTypes'
import { STAGE_TYPES } from '../data/stageTypes'
import { getCurrentStage } from '../systems/StageSystem'
import { BackgroundSystem } from '../systems/BackgroundSystem'
import { ObjectPool } from '../systems/ObjectPool'
import { calculateKillMoney, calculateStageReward } from '../systems/MoneySystem'
import { applyDamageToPlayer, createDamageState, regenerateShield, type PlayerDamageState } from '../systems/DamageSystem'
import { calculateFinalStats } from '../systems/StatsCalculator'
import { findNearestTarget, getSpreadAngles } from '../systems/TargetingSystem'
import { getInstalledModules } from '../systems/ShipSlotSystem'
import { getBossPattern, resolveBossAngles } from '../systems/BossPatternResolver'
import { Mulberry32Rng } from '../systems/Rng'
import type { GameResultSummary, GameState, GameStateSnapshot, GameRuntimeMetrics } from '../types/GameTypes'
import type { BulletSnapshot, EnemySnapshot, TargetSnapshot } from '../types/EnemyTypes'
import type { PlayerSnapshot } from '../types/PlayerTypes'

export class GameScene extends Phaser.Scene {
  private backgroundSystem!: BackgroundSystem
  private player!: PlayerShip
  private damageState!: PlayerDamageState
  private playerBulletPool!: ObjectPool<Bullet>
  private enemyBulletPool!: ObjectPool<Bullet>
  private enemyPool!: ObjectPool<Enemy>
  private explosionPool!: ObjectPool<ExplosionEffect>
  private boss?: Boss
  private rng = new Mulberry32Rng(1001)
  private gameState: GameState = 'StageStart'
  private stageElapsedMs = 0
  private fireCooldownMs = 0
  private enemySeq = 0
  private waveSpawnElapsed = new Map<number, number>()
  private stageKills = 0
  private stageKillMoney = 0
  private cursors?: Record<string, Phaser.Input.Keyboard.Key>
  private dragging = false
  private lastPointerX = 0
  private lastPointerY = 0
  private dragSensitivity = 1
  private hudTexts: Phaser.GameObjects.Text[] = []

  constructor() { super('GameScene') }

  create(): void {
    const ctx = RunContext.current
    const modules = getInstalledModules(ctx.run.shipSlots)
    ctx.playerStats = calculateFinalStats(ctx.playerStats, modules, ctx.playerStats.hp)
    const x = this.scale.width / 2
    const y = this.scale.height - PLAYER_SPAWN_OFFSET_Y
    this.player = new PlayerShip(this, x, y, ctx.playerStats)
    this.damageState = createDamageState(ctx.playerStats)
    this.backgroundSystem = new BackgroundSystem(this)
    this.backgroundSystem.create(this.player.x, this.player.y)

    this.playerBulletPool = new ObjectPool(() => new Bullet(this, 'bullet_player_01'), 48)
    this.enemyBulletPool = new ObjectPool(() => new Bullet(this, 'bullet_enemy_01'), 48)
    this.enemyPool = new ObjectPool(() => new Enemy(this), 20)
    this.explosionPool = new ObjectPool(() => new ExplosionEffect(this), 20)

    this.createHud()
    this.setupInput()
    this.startCurrentStage()
    this.attachTestHooks()
    this.scale.on('resize', this.handleResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup())
  }

  update(time: number, delta: number): void {
    if (this.gameState !== 'Playing' && this.gameState !== 'BossStage') return
    const ctx = RunContext.current
    ctx.run.survivalTime += delta / 1000
    this.stageElapsedMs += delta
    this.damageState.nowMs = time

    this.updatePlayer(delta)
    this.backgroundSystem.update(delta, this.player.x, this.player.y)
    this.updateShield(delta)
    this.updateSpawns(delta)
    this.updateBoss(delta)
    this.updateAutoAttack(delta)
    this.updateBullets(delta)
    this.updateEnemies(delta)
    this.updateExplosions(delta)
    this.handleCollisions(time)
    this.checkStageCompletion()
    this.updateHud()
  }

  private createHud(): void {
    const style = { fontSize: '22px', color: '#dff8ff', fontFamily: 'Arial' }
    this.hudTexts = [
      this.add.text(24, 24, '', style).setDepth(1000),
      this.add.text(24, 56, '', style).setDepth(1000),
      this.add.text(24, 88, '', style).setDepth(1000),
      this.add.text(this.scale.width - 24, 24, '暂停', { ...style, backgroundColor: '#12364a', padding: { x: 14, y: 8 } }).setDepth(1000).setOrigin(1, 0).setInteractive({ useHandCursor: true })
    ]
    this.hudTexts[3].on('pointerup', () => this.pauseGame())
  }

  private updateHud(): void {
    const ctx = RunContext.current
    const stage = getCurrentStage(ctx.run)
    const remaining = Math.max(0, stage.duration - this.stageElapsedMs / 1000)
    this.hudTexts[0].setText(`HP ${Math.ceil(ctx.playerStats.hp)}/${Math.ceil(ctx.playerStats.maxHp)}  SH ${Math.ceil(ctx.playerStats.shield)}/${Math.ceil(ctx.playerStats.maxShield)}`)
    this.hudTexts[1].setText(`${stage.name}  ${stage.type === 'boss' ? 'Boss 战' : `剩余 ${Math.ceil(remaining)}s`}`)
    this.hudTexts[2].setText(`金钱 ${ctx.run.money}  击杀 ${ctx.run.totalKills}`)
  }

  private setupInput(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.addKeys('W,A,S,D,ESC') as Record<string, Phaser.Input.Keyboard.Key>
      this.cursors.ESC.on('down', () => this.pauseGame())
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.gameState !== 'Playing' && this.gameState !== 'BossStage') return
      this.dragging = true
      this.lastPointerX = pointer.x
      this.lastPointerY = pointer.y
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragging) return
      const dx = (pointer.x - this.lastPointerX) * this.dragSensitivity
      const dy = (pointer.y - this.lastPointerY) * this.dragSensitivity
      this.movePlayer(dx, dy)
      this.lastPointerX = pointer.x
      this.lastPointerY = pointer.y
    })

    this.input.on('pointerup', () => { this.dragging = false })
    this.input.on('pointercancel', () => { this.dragging = false })
  }

  private pauseGame(): void {
    if (this.gameState !== 'Playing' && this.gameState !== 'BossStage') return
    this.gameState = 'Paused'
    RunContext.current.run.isPaused = true
    this.backgroundSystem.setPaused(true)
    this.scene.pause()
    this.scene.launch('PauseScene')
  }

  private startCurrentStage(): void {
    const ctx = RunContext.current
    const stage = getCurrentStage(ctx.run)
    this.gameState = stage.type === 'boss' ? 'BossStage' : 'Playing'
    ctx.run.isBossActive = stage.type === 'boss'
    this.stageElapsedMs = 0
    this.stageKills = 0
    this.stageKillMoney = 0
    this.waveSpawnElapsed.clear()
    this.fireCooldownMs = 100
    this.clearCombatObjects()
    if (stage.type === 'boss') {
      this.spawnBoss()
    }
  }

  private updatePlayer(deltaMs: number): void {
    if (this.dragging) return
    const keys = this.cursors
    if (!keys) return
    let dx = 0
    let dy = 0
    const speed = RunContext.current.playerStats.moveSpeed * deltaMs / 1000
    if (keys.A?.isDown) dx -= speed
    if (keys.D?.isDown) dx += speed
    if (keys.W?.isDown) dy -= speed
    if (keys.S?.isDown) dy += speed
    if (dx !== 0 || dy !== 0) this.movePlayer(dx, dy)
  }

  private movePlayer(dx: number, dy: number): void {
    const margin = 42
    const top = 42
    const bottom = this.scale.height - 42
    this.player.x = Phaser.Math.Clamp(this.player.x + dx, margin, this.scale.width - margin)
    this.player.y = Phaser.Math.Clamp(this.player.y + dy, top, bottom)
  }

  private updateShield(deltaMs: number): void {
    const ctx = RunContext.current
    ctx.playerStats = regenerateShield(ctx.playerStats, deltaMs / 1000)
    this.damageState.stats = { ...ctx.playerStats }
    if (ctx.playerStats.shield > 0) this.damageState.shieldBreakReady = true
    this.player.setInvincibleVisual(this.time.now < this.damageState.invincibleUntilMs, this.time.now)
  }

  private updateSpawns(deltaMs: number): void {
    const stage = getCurrentStage(RunContext.current.run)
    if (stage.type !== 'normal') return
    const elapsed = this.stageElapsedMs / 1000
    stage.waves.forEach((wave, index) => {
      if (elapsed < wave.timeStart || elapsed > wave.timeEnd) return
      const aliveForType = this.activeEnemies().filter(enemy => enemy.type === wave.enemyId).length
      if (aliveForType >= wave.maxAlive || this.activeEnemies().length >= MAX_ENEMIES) return
      const elapsedSinceSpawn = (this.waveSpawnElapsed.get(index) ?? wave.spawnInterval) + deltaMs
      if (elapsedSinceSpawn >= wave.spawnInterval) {
        this.spawnEnemy(wave.enemyId, wave.pattern)
        this.waveSpawnElapsed.set(index, 0)
      } else {
        this.waveSpawnElapsed.set(index, elapsedSinceSpawn)
      }
    })
  }

  private spawnEnemy(enemyId: string, pattern = 'top'): string {
    const config = ENEMY_TYPES[enemyId]
    const enemy = this.enemyPool.get()
    let x = this.rng.nextInt(40, this.scale.width - 40)
    let y = -40
    let vx = 0
    let vy = config.moveSpeed
    if (pattern === 'side') {
      const left = this.rng.next() < 0.5
      x = left ? -40 : this.scale.width + 40
      y = this.rng.nextInt(80, Math.floor(this.scale.height * 0.6))
      vx = left ? config.moveSpeed * 0.65 : -config.moveSpeed * 0.65
      vy = config.moveSpeed * 0.35
    } else if (pattern === 'diagonal') {
      x = this.rng.next() < 0.5 ? 30 : this.scale.width - 30
      y = -40
      vx = x < this.scale.width / 2 ? config.moveSpeed * 0.45 : -config.moveSpeed * 0.45
    } else if (pattern === 'random') {
      x = this.rng.nextInt(40, this.scale.width - 40)
      y = this.rng.nextInt(-120, -40)
    }
    enemy.spawn(x, y, { config, vx, vy, createdAt: ++this.enemySeq })
    return enemy.id
  }

  private spawnBoss(hp?: number): string {
    this.boss?.destroy()
    this.boss = new Boss(this, this.scale.width / 2, 170)
    this.boss.spawn(this.scale.width / 2, 170, hp)
    return this.boss.id
  }

  private updateBoss(deltaMs: number): void {
    const boss = this.boss
    if (!boss || !boss.active) return
    boss.update(deltaMs)
    const pattern = getBossPattern(boss.patternIndex)
    if (boss.patternElapsed < pattern.interval) return
    boss.patternElapsed = 0
    boss.patternIndex += 1
    let baseAngle = Math.PI / 2
    if (pattern.kind === 'aimed') {
      baseAngle = Math.atan2(this.player.y - boss.sprite.y, this.player.x - boss.sprite.x)
    }
    const angles = resolveBossAngles(pattern, baseAngle)
    for (const angle of angles) {
      this.spawnEnemyBullet(boss.sprite.x, boss.sprite.y + 70, Math.cos(angle) * pattern.bulletSpeed, Math.sin(angle) * pattern.bulletSpeed, pattern.bulletDamage)
    }
  }

  private updateAutoAttack(deltaMs: number): void {
    this.fireCooldownMs -= deltaMs
    if (this.fireCooldownMs > 0) return
    const stats = RunContext.current.playerStats
    this.fireCooldownMs = 1000 / stats.fireRate
    const target = findNearestTarget({ x: this.player.x, y: this.player.y }, this.getTargets())
    if (!target) {
      this.fireCooldownMs = 0
      return
    }
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x)
    const angles = getSpreadAngles(angle, stats.bulletCount, stats.bulletSpread)
    for (const bulletAngle of angles) {
      if (this.playerBulletPool.activeCount >= MAX_PLAYER_BULLETS) break
      const bullet = this.playerBulletPool.get()
      bullet.spawn(this.player.x, this.player.y - 24, {
        owner: 'player',
        vx: Math.cos(bulletAngle) * stats.bulletSpeed,
        vy: Math.sin(bulletAngle) * stats.bulletSpeed,
        damage: this.rollPlayerDamage(),
        ttlMs: PLAYER_BULLET_TTL_MS,
        targetId: target.id,
        displaySize: 16
      })
    }
  }

  private rollPlayerDamage(): number {
    const stats = RunContext.current.playerStats
    const crit = this.rng.next() < stats.critRate
    return crit ? stats.damage * stats.critDamage : stats.damage
  }

  private updateBullets(deltaMs: number): void {
    for (const bullet of this.playerBulletPool.all()) {
      bullet.update(deltaMs)
      if (bullet.active && this.isOutOfBounds(bullet.sprite.x, bullet.sprite.y, 80)) bullet.despawn()
    }
    for (const bullet of this.enemyBulletPool.all()) {
      bullet.update(deltaMs)
      if (bullet.active && this.isOutOfBounds(bullet.sprite.x, bullet.sprite.y, 120)) bullet.despawn()
    }
  }

  private updateEnemies(deltaMs: number): void {
    for (const enemy of this.activeEnemies()) {
      enemy.update(deltaMs)
      if (enemy.attackInterval > 0 && enemy.attackElapsed >= enemy.attackInterval) {
        enemy.attackElapsed = 0
        this.spawnEnemyBullet(enemy.sprite.x, enemy.sprite.y + 32, 0, enemy.bulletSpeed, enemy.bulletDamage)
      }
      if (this.isOutOfBounds(enemy.sprite.x, enemy.sprite.y, 120)) enemy.despawn()
    }
  }

  private updateExplosions(deltaMs: number): void {
    for (const explosion of this.explosionPool.all()) explosion.update(deltaMs)
  }

  private spawnEnemyBullet(x: number, y: number, vx: number, vy: number, damage: number): void {
    if (this.enemyBulletPool.activeCount >= MAX_ENEMY_BULLETS) return
    const bullet = this.enemyBulletPool.get()
    bullet.spawn(x, y, { owner: 'enemy', vx, vy, damage, ttlMs: ENEMY_BULLET_TTL_MS, displaySize: 20 })
  }

  private handleCollisions(time: number): void {
    for (const bullet of this.playerBulletPool.all()) {
      if (!bullet.active) continue
      let consumed = false
      for (const enemy of this.activeEnemies()) {
        if (this.circleHit(bullet.sprite.x, bullet.sprite.y, bullet.radius, enemy.sprite.x, enemy.sprite.y, enemy.radius)) {
          consumed = true
          if (enemy.takeDamage(bullet.damage)) this.killEnemy(enemy)
          break
        }
      }
      const boss = this.boss
      if (!consumed && boss?.active && this.circleHit(bullet.sprite.x, bullet.sprite.y, bullet.radius, boss.sprite.x, boss.sprite.y, boss.radius)) {
        consumed = true
        if (boss.takeDamage(bullet.damage)) this.winGame()
      }
      if (consumed) bullet.despawn()
    }

    for (const enemy of this.activeEnemies()) {
      if (this.circleHit(enemy.sprite.x, enemy.sprite.y, enemy.radius, this.player.x, this.player.y, this.player.radius)) {
        enemy.despawn()
        this.damagePlayer(enemy.contactDamage, time)
      }
    }

    for (const bullet of this.enemyBulletPool.all()) {
      if (!bullet.active) continue
      if (this.circleHit(bullet.sprite.x, bullet.sprite.y, bullet.radius, this.player.x, this.player.y, this.player.radius)) {
        bullet.despawn()
        this.damagePlayer(bullet.damage, time)
      }
    }
  }

  private damagePlayer(damage: number, now: number): void {
    const ctx = RunContext.current
    this.damageState.nowMs = now
    const result = applyDamageToPlayer(this.damageState, damage, getInstalledModules(ctx.run.shipSlots), INVINCIBLE_MS)
    this.damageState = result.state
    ctx.playerStats = { ...this.damageState.stats }
    if (result.shieldBroken) this.clearEnemyBullets()
    if (result.killed) this.loseGame()
  }

  private killEnemy(enemy: Enemy): void {
    const ctx = RunContext.current
    const config = ENEMY_TYPES[enemy.type]
    const money = calculateKillMoney(config, ctx.playerStats)
    ctx.run.money += money
    ctx.run.totalMoneyEarned += money
    ctx.run.totalKills += 1
    this.stageKills += 1
    this.stageKillMoney += money
    this.spawnExplosion(enemy.sprite.x, enemy.sprite.y)
    enemy.despawn()
  }

  private spawnExplosion(x: number, y: number): void {
    const explosion = this.explosionPool.get()
    explosion.spawn(x, y)
  }

  private checkStageCompletion(): void {
    const ctx = RunContext.current
    const stage = getCurrentStage(ctx.run)
    if (stage.type === 'normal' && this.stageElapsedMs >= stage.duration * 1000) {
      const stageReward = calculateStageReward(stage, ctx.playerStats)
      ctx.run.money += stageReward
      ctx.run.totalMoneyEarned += stageReward
      ctx.lastStageSummary = {
        stageId: stage.id,
        stageName: stage.name,
        kills: this.stageKills,
        killMoney: this.stageKillMoney,
        stageReward,
        hp: ctx.playerStats.hp
      }
      ctx.run.isStageCleared = true
      this.clearCombatObjects()
      this.scene.start('StageResultScene')
    }
  }

  private winGame(): void {
    const ctx = RunContext.current
    this.clearCombatObjects()
    ctx.result = this.createResult('victory')
    this.scene.start('GameResultScene')
  }

  private loseGame(): void {
    const ctx = RunContext.current
    this.clearCombatObjects()
    ctx.result = this.createResult('defeat')
    this.scene.start('GameResultScene')
  }

  private createResult(result: 'victory' | 'defeat'): GameResultSummary {
    const ctx = RunContext.current
    return {
      result,
      totalKills: ctx.run.totalKills,
      totalMoneyEarned: ctx.run.totalMoneyEarned,
      survivalTime: ctx.run.survivalTime,
      bestStageReached: ctx.run.currentStageIndex + 1,
      finalSlots: ctx.run.shipSlots
    }
  }

  private clearCombatObjects(): void {
    this.activeEnemies().forEach(enemy => enemy.despawn())
    this.playerBulletPool?.all().forEach(bullet => bullet.despawn())
    this.enemyBulletPool?.all().forEach(bullet => bullet.despawn())
  }

  private clearEnemyBullets(): void {
    this.enemyBulletPool.all().forEach(bullet => bullet.despawn())
  }

  private activeEnemies(): Enemy[] {
    return this.enemyPool?.all().filter(enemy => enemy.active && !enemy.dead) as Enemy[] ?? []
  }

  private getTargets(): TargetSnapshot[] {
    const targets: TargetSnapshot[] = this.activeEnemies().map(enemy => ({
      id: enemy.id,
      x: enemy.sprite.x,
      y: enemy.sprite.y,
      active: enemy.active,
      dead: enemy.dead,
      inBounds: !this.isOutOfBounds(enemy.sprite.x, enemy.sprite.y, 120),
      createdAt: enemy.createdAt
    }))
    if (this.boss?.active) {
      targets.push({ id: this.boss.id, x: this.boss.sprite.x, y: this.boss.sprite.y, active: true, dead: false, inBounds: true, createdAt: this.boss.createdAt })
    }
    return targets
  }

  private isOutOfBounds(x: number, y: number, margin: number): boolean {
    return x < -margin || x > this.scale.width + margin || y < -margin || y > this.scale.height + margin
  }

  private circleHit(ax: number, ay: number, ar: number, bx: number, by: number, br: number): boolean {
    const dx = ax - bx
    const dy = ay - by
    return dx * dx + dy * dy <= (ar + br) * (ar + br)
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    this.backgroundSystem.resize(gameSize.width, gameSize.height)
  }

  private cleanup(): void {
    this.scale.off('resize', this.handleResize, this)
    this.backgroundSystem?.destroy()
  }

  private attachTestHooks(): void {
    if (typeof window === 'undefined' || import.meta.env.MODE !== 'e2e') return
    const scene = this
    window.__MVP_TEST__ = {
      getStateSnapshot(): GameStateSnapshot {
        const ctx = RunContext.current
        const stage = getCurrentStage(ctx.run)
        return {
          sceneKey: scene.scene.key,
          gameState: scene.gameState,
          currentStageIndex: ctx.run.currentStageIndex,
          money: ctx.run.money,
          totalKills: ctx.run.totalKills,
          survivalTime: ctx.run.survivalTime,
          stageRemaining: Math.max(0, stage.duration - scene.stageElapsedMs / 1000)
        }
      },
      getPlayerSnapshot(): PlayerSnapshot {
        const stats = RunContext.current.playerStats
        return { x: scene.player.x, y: scene.player.y, hp: stats.hp, shield: stats.shield, maxHp: stats.maxHp, maxShield: stats.maxShield, damage: stats.damage, fireRate: stats.fireRate, alive: stats.hp > 0 }
      },
      getEnemySnapshots(): EnemySnapshot[] {
        return scene.activeEnemies().map(enemy => ({ id: enemy.id, x: enemy.sprite.x, y: enemy.sprite.y, active: enemy.active, dead: enemy.dead, inBounds: true, createdAt: enemy.createdAt, hp: enemy.hp, type: enemy.type }))
      },
      getBulletSnapshots(): BulletSnapshot[] {
        return [...scene.playerBulletPool.all(), ...scene.enemyBulletPool.all()].filter(bullet => bullet.active).map(bullet => ({ id: bullet.id, x: bullet.sprite.x, y: bullet.sprite.y, vx: bullet.vx, vy: bullet.vy, owner: bullet.owner, active: bullet.active, targetId: bullet.targetId }))
      },
      getMetrics(): GameRuntimeMetrics {
        return {
          fps: scene.game.loop.actualFps,
          activeEnemies: scene.enemyPool.activeCount,
          activePlayerBullets: scene.playerBulletPool.activeCount,
          activeEnemyBullets: scene.enemyBulletPool.activeCount,
          pooledEnemies: scene.enemyPool.total,
          pooledPlayerBullets: scene.playerBulletPool.total,
          pooledEnemyBullets: scene.enemyBulletPool.total,
          activeTimers: 0,
          currentSceneKey: scene.scene.key,
          currentGameState: scene.gameState
        }
      },
      setRngSeed(seed: number): void { scene.rng = new Mulberry32Rng(seed) },
      startNewRun(): void { scene.scene.start('GameScene') },
      jumpToStage(stageId: string): void {
        const index = STAGE_TYPES.findIndex(stage => stage.id === stageId)
        if (index >= 0) {
          RunContext.current.run.currentStageIndex = index
          scene.startCurrentStage()
        }
      },
      fastForward(ms: number): Promise<void> {
        scene.stageElapsedMs += ms
        return Promise.resolve()
      },
      setPlayerHp(hp: number): void { RunContext.current.playerStats.hp = hp; scene.damageState.stats.hp = hp },
      setPlayerShield(shield: number): void { RunContext.current.playerStats.shield = shield; scene.damageState.stats.shield = shield },
      addMoney(amount: number): void { RunContext.current.run.money += amount },
      unlockAllSlots(): void { RunContext.current.run.shipSlots = RunContext.current.run.shipSlots.map(slot => ({ ...slot, unlocked: true })) },
      spawnEnemy(options: { enemyId?: string, x?: number, y?: number }): string {
        const id = scene.spawnEnemy(options.enemyId ?? 'enemy_small', 'top')
        const enemy = scene.activeEnemies().find(item => item.id === id)
        if (enemy) enemy.sprite.setPosition(options.x ?? enemy.sprite.x, options.y ?? enemy.sprite.y)
        return id
      },
      spawnBoss(options?: { hp?: number }): string { return scene.spawnBoss(options?.hp) },
      clearEnemies(): void { scene.activeEnemies().forEach(enemy => enemy.despawn()) },
      clearBullets(): void { scene.clearCombatObjects() },
      forceStageTimer(seconds: number): void {
        const stage = getCurrentStage(RunContext.current.run)
        scene.stageElapsedMs = Math.max(0, (stage.duration - seconds) * 1000)
      },
      forceModuleChoices(): void { /* StageResultScene owns module choice UI. */ },
      selectModule(): void { /* StageResultScene owns module choice UI. */ },
      installModule(): void { /* StageResultScene owns slot UI. */ }
    }
  }
}
