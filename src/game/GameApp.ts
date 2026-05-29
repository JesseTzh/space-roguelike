import { BACKGROUND_LAYERS } from '../data/backgroundLayers.js'
import { BOSS_PATTERNS } from '../data/bossTypes.js'
import { ENEMY_TYPES, getEnemyConfig } from '../data/enemyTypes.js'
import { getModuleById, MODULE_TYPES } from '../data/moduleTypes.js'
import { PLAYER_BASE_STATS } from '../data/playerBaseStats.js'
import { STAGE_TYPES } from '../data/stageTypes.js'
import { DESIGN_HEIGHT, DESIGN_WIDTH, ENEMY_BULLET_LIMIT, ENEMY_LIMIT, EXPLOSION_LIMIT, PLAYER_BULLET_LIMIT } from './constants.js'
import { GameStateMachine } from './GameStateMachine.js'
import { Boss } from '../entities/Boss.js'
import { Bullet } from '../entities/Bullet.js'
import { Enemy } from '../entities/Enemy.js'
import { ExplosionEffect } from '../entities/ExplosionEffect.js'
import { PlayerShip } from '../entities/PlayerShip.js'
import { AssetLoader, type ImageAssetDefinition } from '../systems/AssetLoader.js'
import { BackgroundSystem } from '../systems/BackgroundSystem.js'
import { applyDamageToPlayer, regenerateShield, updatePlayerRuntime } from '../systems/DamageSystem.js'
import { angleBetween, circlesOverlap, clamp, degToRad, formatTime } from '../systems/MathUtils.js'
import { calculateKillMoney, calculateStageReward } from '../systems/MoneySystem.js'
import { getStageEndHealAmount, rollModuleChoices } from '../systems/ModuleSystem.js'
import { ObjectPool } from '../systems/ObjectPool.js'
import { PlayerAutoAttackSystem } from '../systems/PlayerAutoAttackSystem.js'
import { PlayerControlSystem } from '../systems/PlayerControlSystem.js'
import { SaveSystem } from '../systems/SaveSystem.js'
import { calculateFinalStats } from '../systems/StatsCalculator.js'
import { createInitialSlots, getInstalledModules, installModule, unlockAllSlots, unlockNextSlot, getNextUnlockCost } from '../systems/ShipSlotSystem.js'
import { SeededRng } from '../systems/Rng.js'
import { StageSystem } from '../systems/StageSystem.js'
import { WaveSystem } from '../systems/WaveSystem.js'
import { Hud } from '../ui/Hud.js'
import type { EnemySnapshot, GameStateSnapshot, MvpTestHooks, RunState, RuntimeMetrics, TestBossOptions, TestEnemyOptions, TestRunOptions } from '../types/GameTypes.js'
import type { ShipModule } from '../types/ModuleTypes.js'
import type { PlayerStats } from '../types/PlayerTypes.js'
import type { StageWaveConfig } from '../types/StageTypes.js'

const ENTITY_IMAGE_URLS: ImageAssetDefinition[] = [
  { key: 'player_ship_01', url: 'assets/images/player/player_ship_01.png' },
  { key: 'enemy_small_01', url: 'assets/images/enemies/enemy_small_01.png' },
  { key: 'enemy_fast_01', url: 'assets/images/enemies/enemy_fast_01.png' },
  { key: 'enemy_heavy_01', url: 'assets/images/enemies/enemy_heavy_01.png' },
  { key: 'boss_carrier_01', url: 'assets/images/enemies/boss_carrier_01.png' },
  { key: 'bullet_player_01', url: 'assets/images/bullets/bullet_player_01.png' },
  { key: 'bullet_enemy_01', url: 'assets/images/bullets/bullet_enemy_01.png' },
  { key: 'icon_money_01', url: 'assets/images/ui/icon_money_01.png' },
  { key: 'icon_hp_01', url: 'assets/images/ui/icon_hp_01.png' },
  { key: 'icon_shield_01', url: 'assets/images/ui/icon_shield_01.png' },
  { key: 'ui_button_01', url: 'assets/images/ui/ui_button_01.png' },
  { key: 'ui_module_card_01', url: 'assets/images/ui/ui_module_card_01.png' },
  { key: 'ui_slot_01', url: 'assets/images/ui/ui_slot_01.png' },
  ...BACKGROUND_LAYERS.map(layer => ({ key: layer.key, url: layer.url })),
  ...MODULE_TYPES.map(module => ({ key: `module_${module.id}`, url: `assets/images/modules/module_${module.id}.png` })),
]

function createRunState(): RunState {
  return {
    currentStageIndex: 0,
    money: 0,
    totalKills: 0,
    totalMoneyEarned: 0,
    survivalTime: 0,
    stageKills: 0,
    stageKillMoney: 0,
    isPaused: false,
    isGameOver: false,
    isStageCleared: false,
    isBossActive: false,
    shipSlots: createInitialSlots(),
    reviveChargesUsed: {},
  }
}

export class GameApp {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly uiRoot: HTMLDivElement
  private readonly loader = new AssetLoader()
  private readonly rng = new SeededRng(20260529)
  private readonly stateMachine = new GameStateMachine('Menu')
  private readonly stageSystem = new StageSystem(STAGE_TYPES)
  private readonly waveSystem = new WaveSystem()
  private readonly controlSystem = new PlayerControlSystem()
  private readonly backgroundSystem: BackgroundSystem
  private readonly autoAttackSystem = new PlayerAutoAttackSystem()
  private readonly saveSystem = new SaveSystem()
  private readonly hud = new Hud()
  private readonly playerBulletPool = new ObjectPool(() => new Bullet(), 60, PLAYER_BULLET_LIMIT)
  private readonly enemyBulletPool = new ObjectPool(() => new Bullet(), 60, ENEMY_BULLET_LIMIT)
  private readonly enemyPool = new ObjectPool(() => new Enemy(), 24, ENEMY_LIMIT)
  private readonly explosionPool = new ObjectPool(() => new ExplosionEffect(), 24, EXPLOSION_LIMIT)
  private readonly boss = new Boss()

  private runState: RunState = createRunState()
  private player: PlayerShip = new PlayerShip({ ...PLAYER_BASE_STATS }, DESIGN_WIDTH / 2, DESIGN_HEIGHT - 160, DESIGN_WIDTH, DESIGN_HEIGHT)
  private moduleChoices: ShipModule[] = []
  private selectedModule?: ShipModule
  private installedSelectedModule = false
  private lastTime = 0
  private fps = 60
  private running = false
  private endingRecorded = false

  constructor(private readonly mount: HTMLElement) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = DESIGN_WIDTH
    this.canvas.height = DESIGN_HEIGHT
    this.canvas.setAttribute('aria-label', 'Space Roguelike game canvas')
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.maxWidth = 'calc(100vh * 9 / 16)'
    this.canvas.style.maxHeight = '100vh'
    this.canvas.style.aspectRatio = '9 / 16'
    this.canvas.style.touchAction = 'none'
    this.canvas.style.userSelect = 'none'
    this.canvas.style.display = 'block'

    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context is not available')
    this.ctx = ctx

    this.uiRoot = document.createElement('div')
    this.uiRoot.className = 'ui-root'

    const stage = document.createElement('div')
    stage.className = 'game-stage'
    stage.append(this.canvas, this.uiRoot)
    this.mount.append(stage)

    this.backgroundSystem = new BackgroundSystem(key => this.loader.getImage(key))
    this.controlSystem.attach(this.canvas, this.uiRoot)
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('keydown', event => {
      if (event.code === 'Escape') this.togglePause()
    })
    this.resize()
  }

  async start(): Promise<void> {
    this.renderLoading('正在加载资源...')
    await this.loader.loadImages(ENTITY_IMAGE_URLS)
    this.showMenu()
    this.installTestHooksIfNeeded()
    this.running = true
    this.lastTime = performance.now()
    requestAnimationFrame(time => this.loop(time))
  }

  startNewRun(options: Partial<TestRunOptions> = {}): void {
    this.runState = createRunState()
    this.runState.money = options.money ?? 0
    this.stageSystem.reset(options.stageIndex ?? 0)
    this.runState.currentStageIndex = this.stageSystem.currentIndex
    this.rng.setSeed(options.seed ?? 20260529)
    const stats = calculateFinalStats(PLAYER_BASE_STATS, [], PLAYER_BASE_STATS.hp)
    this.player = new PlayerShip(stats, DESIGN_WIDTH / 2, DESIGN_HEIGHT - 160, DESIGN_WIDTH, DESIGN_HEIGHT)
    this.backgroundSystem.create(this.player.x, this.player.y)
    this.clearCombatObjects()
    this.endingRecorded = false
    this.enterCurrentStage()
  }

  private enterCurrentStage(): void {
    this.clearCombatObjects()
    this.runState.stageKills = 0
    this.runState.stageKillMoney = 0
    this.runState.isStageCleared = false
    this.runState.isBossActive = false
    this.runState.currentStageIndex = this.stageSystem.currentIndex
    this.autoAttackSystem.reset()
    this.waveSystem.startStage(this.stageSystem.currentStage)
    this.player.x = DESIGN_WIDTH / 2
    this.player.y = DESIGN_HEIGHT - 160
    this.player.clampToBounds()
    this.uiRoot.innerHTML = ''

    const currentHp = Math.max(1, this.player.stats.hp)
    this.player.setStats(calculateFinalStats(PLAYER_BASE_STATS, getInstalledModules(this.runState.shipSlots), currentHp))

    if (this.stageSystem.currentStage.type === 'boss') {
      this.runState.isBossActive = true
      this.boss.spawn(DESIGN_WIDTH / 2, 190)
      this.stateMachine.force('BossStage')
    } else {
      this.boss.despawn()
      this.stateMachine.force('Playing')
    }
  }

  private loop(time: number): void {
    if (!this.running) return
    const deltaMs = Math.min(50, Math.max(0, time - this.lastTime))
    this.lastTime = time
    this.fps = this.fps * 0.9 + (deltaMs > 0 ? 1000 / deltaMs : 60) * 0.1
    this.update(deltaMs)
    this.draw()
    requestAnimationFrame(next => this.loop(next))
  }

  private update(deltaMs: number): void {
    const state = this.stateMachine.state
    if (state !== 'Playing' && state !== 'BossStage') return
    if (this.runState.isPaused) return

    const deltaSeconds = deltaMs / 1000
    this.runState.survivalTime += deltaSeconds
    this.stageSystem.update(deltaSeconds)
    this.handlePlayerInput(deltaSeconds)
    updatePlayerRuntime(this.player.runtime, deltaMs, this.player.stats)
    regenerateShield(this.player.stats, deltaSeconds)
    this.backgroundSystem.update(deltaMs, this.player.x, this.player.y)
    this.spawnEnemies()
    this.updateEnemies(deltaMs)
    this.updateBoss(deltaMs)
    this.updateBullets(deltaMs)
    this.updateExplosions(deltaMs)
    this.updateAutoAttack(deltaMs)
    this.handleCollisions()

    if (this.player.stats.hp <= 0 && !this.player.runtime.dead) this.player.runtime.dead = true
    if (this.player.runtime.dead) {
      this.enterDefeat()
      return
    }

    if (this.stageSystem.isNormalStageComplete()) {
      this.enterStageResult()
    }
  }

  private handlePlayerInput(deltaSeconds: number): void {
    if (this.uiRoot.children.length > 0) return
    const drag = this.controlSystem.consumeDrag()
    if (drag.x !== 0 || drag.y !== 0) this.player.moveBy(drag.x, drag.y)
    const keyboard = this.controlSystem.getKeyboardVector()
    this.player.moveDirection(keyboard.x, keyboard.y, deltaSeconds)
  }

  private spawnEnemies(): void {
    if (this.stageSystem.currentStage.type !== 'normal') return
    const waves = this.waveSystem.getSpawnableWaves(
      this.stageSystem.elapsed,
      performance.now(),
      enemyId => this.enemyPool.allItems.filter(enemy => enemy.active && enemy.configId === enemyId).length,
    )
    for (const wave of waves) this.spawnEnemyFromWave(wave)
  }

  private spawnEnemyFromWave(wave: StageWaveConfig): void {
    const enemy = this.enemyPool.get()
    if (!enemy) return
    const config = getEnemyConfig(wave.enemyId)
    let x = this.rng.nextRange(60, DESIGN_WIDTH - 60)
    let y = -40
    let vx = 0
    let vy = config.moveSpeed

    if (wave.pattern === 'side') {
      const left = this.rng.next() < 0.5
      x = left ? -40 : DESIGN_WIDTH + 40
      y = this.rng.nextRange(120, 420)
      vx = left ? config.moveSpeed : -config.moveSpeed
      vy = config.moveSpeed * 0.35
    } else if (wave.pattern === 'diagonal') {
      const left = this.rng.next() < 0.5
      x = left ? -40 : DESIGN_WIDTH + 40
      y = -40
      vx = left ? config.moveSpeed * 0.55 : -config.moveSpeed * 0.55
      vy = config.moveSpeed
    } else if (wave.pattern === 'random') {
      x = this.rng.nextRange(40, DESIGN_WIDTH - 40)
      y = this.rng.nextRange(-120, -40)
      vx = this.rng.nextRange(-50, 50)
    }

    enemy.spawn(x, y, { config, vx, vy })
  }

  private updateEnemies(deltaMs: number): void {
    for (const enemy of this.enemyPool.allItems) {
      if (!enemy.active) continue
      enemy.update(deltaMs)
      if (enemy.config.attack && enemy.fireCooldownMs <= 0) {
        this.spawnEnemyBullet(enemy.x, enemy.y + 30, 0, enemy.config.attack.bulletSpeed, enemy.config.attack.bulletDamage)
        enemy.fireCooldownMs += enemy.config.attack.fireInterval * 1000
      }
      if (enemy.y > DESIGN_HEIGHT + 120 || enemy.x < -160 || enemy.x > DESIGN_WIDTH + 160 || enemy.dead) {
        enemy.despawn()
      }
    }
  }

  private updateBoss(deltaMs: number): void {
    if (!this.boss.active || this.boss.dead) return
    const targetY = 190
    this.boss.y += (targetY - this.boss.y) * 0.02
    const pattern = BOSS_PATTERNS[this.boss.patternIndex % BOSS_PATTERNS.length]
    if (!pattern) return
    this.boss.patternElapsedMs += deltaMs
    if (this.boss.patternElapsedMs >= pattern.interval * 1000) {
      this.boss.patternElapsedMs = 0
      this.fireBossPattern(pattern.id, pattern.bulletCount, pattern.bulletDamage, pattern.bulletSpeed)
      this.boss.patternIndex += 1
    }
  }

  private fireBossPattern(pattern: 'line' | 'fan' | 'aimed', count: number, damage: number, speed: number): void {
    if (pattern === 'line') {
      for (let i = 0; i < count; i += 1) {
        const offset = (i - (count - 1) / 2) * 36
        this.spawnEnemyBullet(this.boss.x + offset, this.boss.y + 95, 0, speed, damage)
      }
      return
    }

    if (pattern === 'fan') {
      const spread = degToRad(90)
      const base = Math.PI / 2
      for (let i = 0; i < count; i += 1) {
        const angle = base - spread / 2 + (spread * i) / Math.max(1, count - 1)
        this.spawnEnemyBullet(this.boss.x, this.boss.y + 95, Math.cos(angle) * speed, Math.sin(angle) * speed, damage)
      }
      return
    }

    for (let i = 0; i < count; i += 1) {
      const angle = angleBetween(this.boss, this.player) + degToRad((i - (count - 1) / 2) * 10)
      this.spawnEnemyBullet(this.boss.x, this.boss.y + 95, Math.cos(angle) * speed, Math.sin(angle) * speed, damage)
    }
  }

  private updateBullets(deltaMs: number): void {
    for (const bullet of this.playerBulletPool.allItems) {
      if (!bullet.active) continue
      bullet.update(deltaMs)
      if (bullet.x < -50 || bullet.x > DESIGN_WIDTH + 50 || bullet.y < -50 || bullet.y > DESIGN_HEIGHT + 50) bullet.despawn()
    }
    for (const bullet of this.enemyBulletPool.allItems) {
      if (!bullet.active) continue
      bullet.update(deltaMs)
      if (bullet.x < -50 || bullet.x > DESIGN_WIDTH + 50 || bullet.y < -50 || bullet.y > DESIGN_HEIGHT + 50) bullet.despawn()
    }
  }

  private updateExplosions(deltaMs: number): void {
    for (const explosion of this.explosionPool.allItems) {
      if (explosion.active) explosion.update(deltaMs)
    }
  }

  private updateAutoAttack(deltaMs: number): void {
    const targets = [
      ...this.enemyPool.allItems.filter(enemy => enemy.active && !enemy.dead),
      ...(this.boss.active && !this.boss.dead ? [{ ...this.boss, configId: 'boss_01' }] : []),
    ]
    const commands = this.autoAttackSystem.update(deltaMs, this.player, this.player.stats, targets)
    for (const command of commands) {
      const bullet = this.playerBulletPool.get()
      if (!bullet) continue
      bullet.spawn(command.x, command.y, {
        owner: 'player',
        vx: command.vx,
        vy: command.vy,
        damage: command.damage,
        radius: 12,
        lifetimeMs: 2000,
      })
    }
  }

  private spawnEnemyBullet(x: number, y: number, vx: number, vy: number, damage: number): void {
    const bullet = this.enemyBulletPool.get()
    if (!bullet) return
    bullet.spawn(x, y, {
      owner: 'enemy',
      vx,
      vy,
      damage,
      radius: 12,
      lifetimeMs: 5000,
    })
  }

  private handleCollisions(): void {
    for (const bullet of this.playerBulletPool.allItems) {
      if (!bullet.active) continue
      let consumed = false
      for (const enemy of this.enemyPool.allItems) {
        if (!enemy.active || enemy.dead) continue
        if (!circlesOverlap({ x: bullet.x, y: bullet.y, radius: bullet.radius }, { x: enemy.x, y: enemy.y, radius: enemy.radius })) continue
        const critical = this.rng.next() < this.player.stats.critRate
        const damage = critical ? bullet.damage * this.player.stats.critDamage : bullet.damage
        const killed = enemy.takeDamage(damage)
        bullet.despawn()
        consumed = true
        if (killed) this.killEnemy(enemy)
        break
      }
      if (consumed) continue
      if (this.boss.active && !this.boss.dead && circlesOverlap({ x: bullet.x, y: bullet.y, radius: bullet.radius }, { x: this.boss.x, y: this.boss.y, radius: this.boss.radius })) {
        const critical = this.rng.next() < this.player.stats.critRate
        const damage = critical ? bullet.damage * this.player.stats.critDamage : bullet.damage
        const killed = this.boss.takeDamage(damage)
        bullet.despawn()
        if (killed) this.enterVictory()
      }
    }

    for (const enemy of this.enemyPool.allItems) {
      if (!enemy.active || enemy.dead) continue
      if (circlesOverlap({ x: this.player.x, y: this.player.y, radius: this.player.radius }, { x: enemy.x, y: enemy.y, radius: enemy.radius })) {
        const result = applyDamageToPlayer(this.player.stats, this.player.runtime, enemy.config.contactDamage, getInstalledModules(this.runState.shipSlots), this.runState.reviveChargesUsed)
        if (result.shieldBroke) this.clearEnemyBullets()
        this.spawnExplosion(enemy.x, enemy.y, enemy.radius)
        enemy.despawn()
      }
    }

    if (this.boss.active && !this.boss.dead && circlesOverlap({ x: this.player.x, y: this.player.y, radius: this.player.radius }, { x: this.boss.x, y: this.boss.y, radius: this.boss.radius })) {
      const result = applyDamageToPlayer(this.player.stats, this.player.runtime, this.boss.config.contactDamage, getInstalledModules(this.runState.shipSlots), this.runState.reviveChargesUsed)
      if (result.shieldBroke) this.clearEnemyBullets()
    }

    for (const bullet of this.enemyBulletPool.allItems) {
      if (!bullet.active) continue
      if (circlesOverlap({ x: bullet.x, y: bullet.y, radius: bullet.radius }, { x: this.player.x, y: this.player.y, radius: this.player.radius })) {
        const result = applyDamageToPlayer(this.player.stats, this.player.runtime, bullet.damage, getInstalledModules(this.runState.shipSlots), this.runState.reviveChargesUsed)
        bullet.despawn()
        if (result.shieldBroke) this.clearEnemyBullets()
      }
    }
  }

  private killEnemy(enemy: Enemy): void {
    const reward = calculateKillMoney(enemy.config, this.player.stats)
    this.runState.money += reward
    this.runState.totalMoneyEarned += reward
    this.runState.totalKills += 1
    this.runState.stageKills += 1
    this.runState.stageKillMoney += reward
    this.spawnExplosion(enemy.x, enemy.y, enemy.radius)
    enemy.despawn()
  }

  private spawnExplosion(x: number, y: number, radius = 32): void {
    const explosion = this.explosionPool.get()
    if (explosion) explosion.spawn(x, y, { radius })
  }

  private enterStageResult(): void {
    this.stateMachine.force('StageCleared')
    this.clearCombatObjects()
    this.runState.isStageCleared = true
    const stageReward = calculateStageReward(this.stageSystem.currentStage, this.player.stats)
    this.runState.money += stageReward
    this.runState.totalMoneyEarned += stageReward
    const heal = getStageEndHealAmount(getInstalledModules(this.runState.shipSlots))
    this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + heal)
    this.moduleChoices = this.moduleChoices.length > 0 ? this.moduleChoices : rollModuleChoices(this.rng)
    this.selectedModule = undefined
    this.installedSelectedModule = false
    this.stateMachine.force('StageResult')
    this.renderStageResult(stageReward, heal)
  }

  private renderStageResult(stageReward: number, heal: number): void {
    const modulesHtml = this.moduleChoices.map(module => `
      <button class="card module-card" data-module-id="${module.id}">
        <img src="assets/images/modules/module_${module.id}.png" alt="" />
        <strong>${module.name}</strong>
        <span>${module.rarity} · ${module.category}</span>
        <p>${module.description}</p>
      </button>
    `).join('')

    const slotsHtml = this.runState.shipSlots.map(slot => `
      <button class="slot ${slot.unlocked ? 'unlocked' : 'locked'}" data-slot-id="${slot.id}" ${slot.unlocked ? '' : 'disabled'}>
        <span>${slot.id.replace('slot_', '#')}</span>
        <strong>${slot.unlocked ? slot.module?.name ?? '空槽' : '未解锁'}</strong>
      </button>
    `).join('')

    const nextCost = getNextUnlockCost(this.runState.shipSlots)
    this.uiRoot.innerHTML = `
      <section class="panel stage-result">
        <h1>${this.stageSystem.currentStage.name} 完成</h1>
        <div class="result-grid">
          <div class="summary">
            <p>本关击杀：${this.runState.stageKills}</p>
            <p>击杀金钱：${this.runState.stageKillMoney}</p>
            <p>关卡奖励：${stageReward}</p>
            <p>维修恢复：${heal}</p>
            <p>当前金钱：${this.runState.money}</p>
            <p>剩余生命：${Math.ceil(this.player.stats.hp)} / ${Math.ceil(this.player.stats.maxHp)}</p>
          </div>
          <div class="modules"><h2>选择 1 个强化模块</h2>${modulesHtml}</div>
          <div class="slots"><h2>安装到通用插槽</h2>${slotsHtml}<button class="primary" data-action="buy-slot">购买新插槽${nextCost ? `（${nextCost}）` : '（已满）'}</button></div>
        </div>
        <div class="panel-actions">
          <button data-action="menu">返回首页</button>
          <button class="primary" data-action="next-stage" ${this.installedSelectedModule ? '' : 'disabled'}>进入下一关</button>
        </div>
      </section>
    `

    for (const button of this.uiRoot.querySelectorAll<HTMLButtonElement>('[data-module-id]')) {
      button.addEventListener('click', () => {
        const id = button.dataset.moduleId
        if (!id) return
        this.selectedModule = getModuleById(id)
        this.stateMachine.force('SlotInstall')
        this.renderStageResult(stageReward, heal)
      })
    }

    for (const button of this.uiRoot.querySelectorAll<HTMLButtonElement>('[data-slot-id]')) {
      button.addEventListener('click', () => {
        const slotId = button.dataset.slotId
        if (!slotId || !this.selectedModule) return
        const slot = this.runState.shipSlots.find(item => item.id === slotId)
        if (!slot?.unlocked) return
        if (slot.module && !window.confirm(`替换 ${slot.module.name} 为 ${this.selectedModule.name}？`)) return
        this.runState.shipSlots = installModule(this.runState.shipSlots, slotId, this.selectedModule)
        this.installedSelectedModule = true
        this.player.setStats(calculateFinalStats(PLAYER_BASE_STATS, getInstalledModules(this.runState.shipSlots), this.player.stats.hp))
        this.renderStageResult(stageReward, heal)
      })
    }

    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="buy-slot"]')?.addEventListener('click', () => {
      try {
        const result = unlockNextSlot(this.runState.shipSlots, this.runState.money)
        this.runState.shipSlots = result.slots
        this.runState.money = result.money
        this.renderStageResult(stageReward, heal)
      } catch (error) {
        window.alert(error instanceof Error ? error.message : String(error))
      }
    })

    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="next-stage"]')?.addEventListener('click', () => {
      if (!this.installedSelectedModule) return
      this.moduleChoices = []
      this.selectedModule = undefined
      this.installedSelectedModule = false
      this.stageSystem.nextStage()
      this.stateMachine.force('NextStage')
      this.enterCurrentStage()
    })

    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="menu"]')?.addEventListener('click', () => this.showMenu())
  }

  private enterVictory(): void {
    if (this.stateMachine.state === 'Victory' || this.stateMachine.state === 'GameResult') return
    const reward = this.boss.config.money
    this.runState.money += reward
    this.runState.totalMoneyEarned += reward
    this.runState.isBossActive = false
    this.clearCombatObjects()
    this.boss.despawn()
    this.stateMachine.force('Victory')
    this.renderGameResult('clear')
  }

  private enterDefeat(): void {
    if (this.stateMachine.state === 'Defeat' || this.stateMachine.state === 'GameResult') return
    this.clearCombatObjects()
    this.boss.despawn()
    this.stateMachine.force('Defeat')
    this.renderGameResult('death')
  }

  private renderGameResult(result: 'clear' | 'death'): void {
    if (!this.endingRecorded) {
      this.saveSystem.recordRun(result, this.runState.totalKills, this.runState.survivalTime, this.stageSystem.currentIndex + 1)
      this.endingRecorded = true
    }
    this.stateMachine.force('GameResult')
    const modules = getInstalledModules(this.runState.shipSlots)
    this.uiRoot.innerHTML = `
      <section class="panel game-result">
        <h1>${result === 'clear' ? '通关成功' : '任务失败'}</h1>
        <p>最终关卡：${this.stageSystem.currentStage.name}</p>
        <p>总击杀数：${this.runState.totalKills}</p>
        <p>总获得金钱：${this.runState.totalMoneyEarned}</p>
        <p>最终存活时间：${formatTime(this.runState.survivalTime)}</p>
        <p>最终构筑：${modules.length ? modules.map(module => module.name).join('、') : '无模块'}</p>
        <div class="panel-actions">
          <button class="primary" data-action="restart">重新开始</button>
          <button data-action="menu">返回首页</button>
        </div>
      </section>
    `
    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="restart"]')?.addEventListener('click', () => this.startNewRun())
    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="menu"]')?.addEventListener('click', () => this.showMenu())
  }

  private togglePause(): void {
    const state = this.stateMachine.state
    if (state !== 'Playing' && state !== 'BossStage' && state !== 'Paused') return
    if (this.runState.isPaused) {
      this.runState.isPaused = false
      this.backgroundSystem.setPaused(false)
      this.uiRoot.innerHTML = ''
      this.stateMachine.force(this.stageSystem.currentStage.type === 'boss' ? 'BossStage' : 'Playing')
    } else {
      this.runState.isPaused = true
      this.backgroundSystem.setPaused(true)
      this.stateMachine.force('Paused')
      this.renderPause()
    }
  }

  private renderPause(): void {
    this.uiRoot.innerHTML = `
      <section class="panel pause-panel">
        <h1>暂停</h1>
        <button class="primary" data-action="resume">继续游戏</button>
        <button data-action="menu">返回首页</button>
      </section>
    `
    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="resume"]')?.addEventListener('click', () => this.togglePause())
    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="menu"]')?.addEventListener('click', () => this.showMenu())
  }

  private showMenu(): void {
    this.clearCombatObjects()
    this.boss.despawn()
    this.runState = createRunState()
    this.stateMachine.force('Menu')
    const save = this.saveSystem.load()
    this.uiRoot.innerHTML = `
      <section class="panel menu-panel">
        <h1>星际构筑弹幕</h1>
        <p>2D Roguelike 飞船弹幕 MVP</p>
        <button class="primary large" data-action="start">开始游戏</button>
        <div class="summary">
          <p>通关次数：${save.clearCount}</p>
          <p>失败次数：${save.deathCount}</p>
          <p>最长存活：${formatTime(save.bestSurvivalTime)}</p>
          <p>最远关卡：Stage ${save.bestStageReached}</p>
        </div>
        <label><input type="checkbox" data-setting="music" ${save.settings.musicEnabled ? 'checked' : ''} /> 背景音乐</label>
        <label><input type="checkbox" data-setting="sfx" ${save.settings.sfxEnabled ? 'checked' : ''} /> 音效</label>
        <label><input type="checkbox" data-setting="vibration" ${save.settings.vibrationEnabled ? 'checked' : ''} /> 震动</label>
      </section>
    `
    this.uiRoot.querySelector<HTMLButtonElement>('[data-action="start"]')?.addEventListener('click', () => this.startNewRun())
    for (const input of this.uiRoot.querySelectorAll<HTMLInputElement>('[data-setting]')) {
      input.addEventListener('change', () => {
        const data = this.saveSystem.load()
        if (input.dataset.setting === 'music') data.settings.musicEnabled = input.checked
        if (input.dataset.setting === 'sfx') data.settings.sfxEnabled = input.checked
        if (input.dataset.setting === 'vibration') data.settings.vibrationEnabled = input.checked
        this.saveSystem.save(data)
      })
    }
  }

  private renderLoading(message: string): void {
    this.uiRoot.innerHTML = `<section class="panel menu-panel"><h1>${message}</h1></section>`
  }

  private draw(): void {
    this.backgroundSystem.draw(this.ctx, DESIGN_WIDTH, DESIGN_HEIGHT)
    if (this.stateMachine.state === 'Menu') {
      this.drawTitleBackdrop()
      return
    }
    this.drawEntities()
    const state = this.stateMachine.state
    if (state === 'Playing' || state === 'BossStage' || state === 'Paused') {
      this.hud.draw(this.ctx, {
        stats: this.player.stats,
        money: this.runState.money,
        stage: this.stageSystem.currentStage,
        remainingSeconds: this.stageSystem.currentStage.type === 'normal' ? this.stageSystem.remaining : this.stageSystem.currentStage.duration,
        bossHp: this.boss.active ? this.boss.hp : undefined,
        bossMaxHp: this.boss.active ? this.boss.maxHp : undefined,
      })
    }
  }

  private drawTitleBackdrop(): void {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
    ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
    ctx.restore()
  }

  private drawEntities(): void {
    this.drawImageOrShape('player_ship_01', this.player.x, this.player.y, 86, 86, '#42d6ff')

    for (const enemy of this.enemyPool.allItems) {
      if (!enemy.active) continue
      const size = enemy.configId === 'enemy_heavy' ? 92 : 62
      this.drawImageOrShape(enemy.config.texture, enemy.x, enemy.y, size, size, '#ff5e3a')
      this.drawSmallHpBar(enemy.x, enemy.y - size / 2 - 8, size, enemy.hp / enemy.config.hp)
    }

    if (this.boss.active) {
      this.drawImageOrShape('boss_carrier_01', this.boss.x, this.boss.y, 360, 260, '#ff7842')
    }

    for (const bullet of this.playerBulletPool.allItems) {
      if (!bullet.active) continue
      this.drawImageOrShape('bullet_player_01', bullet.x, bullet.y, 26, 38, '#55d5ff')
    }
    for (const bullet of this.enemyBulletPool.allItems) {
      if (!bullet.active) continue
      this.drawImageOrShape('bullet_enemy_01', bullet.x, bullet.y, 26, 26, '#ff5a30')
    }

    for (const explosion of this.explosionPool.allItems) {
      if (!explosion.active) continue
      const ratio = explosion.ageMs / explosion.durationMs
      this.ctx.save()
      this.ctx.globalAlpha = 1 - ratio
      this.ctx.fillStyle = '#ffb347'
      this.ctx.beginPath()
      this.ctx.arc(explosion.x, explosion.y, explosion.radius * (0.4 + ratio), 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }

  private drawImageOrShape(key: string, x: number, y: number, width: number, height: number, fallbackColor: string): void {
    const image = this.loader.getImage(key)
    this.ctx.save()
    if (image && image.complete && image.naturalWidth > 0) {
      this.ctx.drawImage(image, x - width / 2, y - height / 2, width, height)
    } else {
      this.ctx.fillStyle = fallbackColor
      this.ctx.beginPath()
      this.ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2)
      this.ctx.fill()
    }
    this.ctx.restore()
  }

  private drawSmallHpBar(x: number, y: number, width: number, ratio: number): void {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)'
    this.ctx.fillRect(x - width / 2, y, width, 5)
    this.ctx.fillStyle = '#ff6650'
    this.ctx.fillRect(x - width / 2, y, width * clamp(ratio, 0, 1), 5)
    this.ctx.restore()
  }

  private clearEnemyBullets(): void {
    this.enemyBulletPool.releaseAll()
  }

  private clearCombatObjects(): void {
    this.enemyPool.releaseAll()
    this.playerBulletPool.releaseAll()
    this.enemyBulletPool.releaseAll()
    this.explosionPool.releaseAll()
    this.waveSystem.clear()
  }

  private resize(): void {
    this.backgroundSystem.resize(DESIGN_WIDTH, DESIGN_HEIGHT)
  }

  getStateSnapshot(): GameStateSnapshot {
    return {
      state: this.stateMachine.state,
      stageId: this.stageSystem.currentStage.id,
      stageIndex: this.stageSystem.currentIndex,
      money: this.runState.money,
      totalKills: this.runState.totalKills,
      survivalTime: this.runState.survivalTime,
      isBossActive: this.boss.active,
    }
  }

  getMetrics(): RuntimeMetrics {
    return {
      fps: this.fps,
      activeEnemies: this.enemyPool.activeCount,
      activePlayerBullets: this.playerBulletPool.activeCount,
      activeEnemyBullets: this.enemyBulletPool.activeCount,
      pooledEnemies: this.enemyPool.totalCount,
      pooledPlayerBullets: this.playerBulletPool.totalCount,
      pooledEnemyBullets: this.enemyBulletPool.totalCount,
      activeExplosions: this.explosionPool.activeCount,
      currentSceneKey: 'CanvasGameScene',
      currentGameState: this.stateMachine.state,
    }
  }

  private installTestHooksIfNeeded(): void {
    const isE2E = new URLSearchParams(window.location.search).has('e2e') || Boolean((import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'e2e')
    if (!isE2E) return
    const hooks: MvpTestHooks = {
      getStateSnapshot: () => this.getStateSnapshot(),
      getPlayerSnapshot: () => ({ ...this.player.stats, x: this.player.x, y: this.player.y }),
      getEnemySnapshots: () => this.getEnemySnapshots(),
      getBulletSnapshots: () => [
        ...this.playerBulletPool.allItems.filter(item => item.active).map(item => ({ id: item.id, owner: item.owner, x: item.x, y: item.y, vx: item.vx, vy: item.vy, active: item.active })),
        ...this.enemyBulletPool.allItems.filter(item => item.active).map(item => ({ id: item.id, owner: item.owner, x: item.x, y: item.y, vx: item.vx, vy: item.vy, active: item.active })),
      ],
      getMetrics: () => this.getMetrics(),
      setRngSeed: seed => this.rng.setSeed(seed),
      startNewRun: options => this.startNewRun(options),
      jumpToStage: stageId => {
        this.stageSystem.jumpToStage(stageId)
        this.enterCurrentStage()
      },
      fastForward: async ms => {
        let remaining = ms
        while (remaining > 0) {
          const step = Math.min(50, remaining)
          this.update(step)
          remaining -= step
        }
        this.draw()
      },
      setPlayerHp: hp => {
        this.player.stats.hp = clamp(hp, 0, this.player.stats.maxHp)
        this.player.runtime.dead = this.player.stats.hp <= 0
      },
      setPlayerShield: shield => {
        this.player.stats.shield = clamp(shield, 0, this.player.stats.maxShield)
      },
      addMoney: amount => {
        this.runState.money += amount
      },
      unlockAllSlots: () => {
        this.runState.shipSlots = unlockAllSlots(this.runState.shipSlots)
      },
      spawnEnemy: options => this.spawnTestEnemy(options),
      spawnBoss: options => this.spawnTestBoss(options),
      clearEnemies: () => this.enemyPool.releaseAll(),
      clearBullets: () => {
        this.playerBulletPool.releaseAll()
        this.enemyBulletPool.releaseAll()
      },
      forceStageTimer: seconds => this.stageSystem.forceTimer(seconds),
      forceModuleChoices: moduleIds => {
        this.moduleChoices = moduleIds.map(id => getModuleById(id))
      },
      selectModule: moduleId => {
        this.selectedModule = getModuleById(moduleId)
        this.installedSelectedModule = false
      },
      installModule: slotId => {
        if (!this.selectedModule) throw new Error('No module selected')
        this.runState.shipSlots = installModule(this.runState.shipSlots, slotId, this.selectedModule)
        this.installedSelectedModule = true
        this.player.setStats(calculateFinalStats(PLAYER_BASE_STATS, getInstalledModules(this.runState.shipSlots), this.player.stats.hp))
      },
    }
    window.__MVP_TEST__ = hooks
  }

  private getEnemySnapshots(): EnemySnapshot[] {
    return [
      ...this.enemyPool.allItems.filter(item => item.active).map(enemy => ({ id: enemy.id, configId: enemy.configId, hp: enemy.hp, active: enemy.active, boss: false, x: enemy.x, y: enemy.y })),
      ...(this.boss.active ? [{ id: this.boss.id, configId: 'boss_01', hp: this.boss.hp, active: this.boss.active, boss: true, x: this.boss.x, y: this.boss.y }] : []),
    ]
  }

  private spawnTestEnemy(options: TestEnemyOptions): string {
    const enemy = this.enemyPool.get()
    if (!enemy) throw new Error('Enemy pool is full')
    const config = getEnemyConfig(options.enemyId)
    enemy.spawn(options.x, options.y, { config, vx: 0, vy: 0, hp: options.hp })
    return enemy.id
  }

  private spawnTestBoss(options: Partial<TestBossOptions> = {}): string {
    this.boss.spawn(options.x ?? DESIGN_WIDTH / 2, options.y ?? 190, options.hp ?? 2000)
    this.runState.isBossActive = true
    this.stateMachine.force('BossStage')
    return this.boss.id
  }
}
