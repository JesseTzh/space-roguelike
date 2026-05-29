import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants'
import { GameStateMachine } from '../game/GameStateMachine'
import { createInitialRunState, type RunState, type LastStageResult } from '../game/RunState'
import { PlayerShip } from '../entities/PlayerShip'
import { BackgroundSystem } from '../systems/BackgroundSystem'
import { BulletSystem } from '../systems/BulletSystem'
import { EnemySpawner } from '../systems/EnemySpawner'
import { EnemyAttackSystem } from '../systems/EnemyAttackSystem'
import { BossSystem } from '../systems/BossSystem'
import { PlayerControlSystem } from '../systems/PlayerControlSystem'
import { PlayerAutoAttackSystem } from '../systems/PlayerAutoAttackSystem'
import { CollisionSystem } from '../systems/CollisionSystem'
import { DamageSystem } from '../systems/DamageSystem'
import { StageSystem } from '../systems/StageSystem'
import { MoneySystem } from '../systems/MoneySystem'
import { ShipBuildSystem } from '../systems/ShipBuildSystem'
import { SaveSystem } from '../systems/SaveSystem'
import { AudioSystem } from '../systems/AudioSystem'
import { Hud } from '../ui/Hud'
import { PausePanel } from '../ui/PausePanel'
import { createBasePlayerStats } from '../game/data/playerBaseStats'
import { calculateFinalStats } from '../systems/StatsCalculator'
import { getEnemyConfig } from '../game/data/enemyTypes'
import { getStageByIndex, STAGE_TYPES } from '../game/data/stageTypes'
import { sumEffectValue } from '../systems/ModuleEventResolver'
import { installTestHooks } from '../game/test-support/testHooks'

export class GameScene extends Phaser.Scene {
  fsm!: GameStateMachine
  run!: RunState
  ship!: PlayerShip
  background!: BackgroundSystem
  bullets!: BulletSystem
  spawner!: EnemySpawner
  enemyAttack!: EnemyAttackSystem
  boss!: BossSystem
  control!: PlayerControlSystem
  autoAttack!: PlayerAutoAttackSystem
  collision!: CollisionSystem
  damage!: DamageSystem
  stage!: StageSystem
  money!: MoneySystem
  build!: ShipBuildSystem
  save!: SaveSystem
  audio!: AudioSystem
  hud!: Hud
  pausePanel: PausePanel | null = null
  lastStageResult: LastStageResult | null = null

  private currentStageKills = 0
  private currentStageMoney = 0

  constructor() {
    super('Game')
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#040814')

    this.fsm = new GameStateMachine()
    this.run = createInitialRunState()
    this.audio = new AudioSystem(this)
    this.save = new SaveSystem()
    const saveData = this.save.load()
    this.audio.setSettings({
      musicEnabled: saveData.settings.musicEnabled,
      sfxEnabled: saveData.settings.sfxEnabled,
    })

    this.ship = new PlayerShip(this, GAME_WIDTH / 2, GAME_HEIGHT - 220)
    this.ship.setStats(createBasePlayerStats())

    this.background = new BackgroundSystem(this)
    this.background.create(this.ship.x, this.ship.y)

    this.bullets = new BulletSystem(this)
    this.spawner = new EnemySpawner(this)
    this.enemyAttack = new EnemyAttackSystem(this, this.bullets, () => this.ship)
    this.boss = new BossSystem(this, this.bullets, () => this.ship)
    this.money = new MoneySystem()

    this.build = new ShipBuildSystem({
      ship: this.ship,
      slots: this.run.shipSlots,
      onStatsChanged: stats => {
        this.hud?.setHp(stats.hp, stats.maxHp)
        this.hud?.setShield(stats.shield, stats.maxShield)
      },
    })

    this.control = new PlayerControlSystem(this, this.ship)
    this.autoAttack = new PlayerAutoAttackSystem(this, this.ship, this.bullets, {
      getEnemies: () => this.spawner.getActiveEnemies(),
      getBoss: () => this.boss.boss,
    })

    this.damage = new DamageSystem({
      ship: this.ship,
      bullets: this.bullets,
      getInstalledModules: () => this.build.getInstalledModules(),
      onShieldBroken: () => {
        this.audio.playSfx('shield_break')
      },
      onDied: () => {
        this.handlePlayerDied()
      },
      onRevived: () => {
        this.audio.playSfx('revive')
      },
      tryRevive: () => this.tryRevive(),
    })

    this.collision = new CollisionSystem({
      bullets: this.bullets,
      enemies: this.spawner,
      boss: this.boss,
      player: this.ship,
      isPlayerInvincible: () => this.ship.isInvincible(this.time.now),
      onBulletHitEnemy: e => {
        if (e.killed) {
          this.bullets.spawnExplosion(e.enemy.x, e.enemy.y)
          this.run.totalKills++
          this.currentStageKills++
          const cfg = getEnemyConfig(e.enemy.configId)
          if (cfg) {
            const m = this.money.awardKill(cfg, this.ship.stats)
            this.currentStageMoney += m
            this.run.totalMoneyEarned += m
            this.run.money = this.money.total
          }
          e.enemy.despawn()
        }
      },
      onBulletHitBoss: e => {
        if (e.killed) {
          this.bullets.spawnExplosion(e.boss.x, e.boss.y)
        }
        this.hud.setBossHp(e.boss.hp, e.boss.maxHp)
      },
      onPlayerHit: e => {
        const result = this.damage.applyDamage(e.damage, this.time.now)
        this.hud.setHp(result.hpAfter, this.ship.stats.maxHp)
        this.hud.setShield(result.shieldAfter, this.ship.stats.maxShield)
      },
    })

    this.stage = new StageSystem({
      spawner: this.spawner,
      boss: this.boss,
      bullets: this.bullets,
      events: {
        onStageStart: stage => {
          this.currentStageKills = 0
          this.currentStageMoney = 0
          this.hud.setStage(stage.name)
          this.hud.hideBossBar()
          if (stage.type === 'boss') {
            this.hud.showBossBar('巡航母舰')
          }
        },
        onStageCleared: stage => {
          this.applyStageEndModuleEffects()
          if (stage.type === 'normal') {
            const reward = this.money.awardStageReward(stage, this.ship.stats)
            this.run.totalMoneyEarned += reward
            this.run.money = this.money.total
            this.lastStageResult = {
              stageId: stage.id,
              kills: this.currentStageKills,
              killMoney: this.currentStageMoney,
              stageReward: reward,
              prevHp: this.ship.stats.hp,
              finalHpBonus: 0,
            }
          } else {
            this.lastStageResult = {
              stageId: stage.id,
              kills: this.currentStageKills,
              killMoney: this.currentStageMoney,
              stageReward: 0,
              prevHp: this.ship.stats.hp,
              finalHpBonus: 0,
            }
          }
          this.run.isStageCleared = true
          this.fsm.transitionTo('StageCleared')
          this.fsm.transitionTo('StageResult')
          this.scene.launch('StageResult', { gameScene: this })
          this.scene.pause()
        },
        onAllStagesCleared: () => {
          // 由 StageResult/Game 流程处理胜利
        },
      },
    })

    this.hud = new Hud(this)

    this.input.keyboard?.on('keydown-ESC', () => this.togglePause())
    this.input.keyboard?.on('keydown-P', () => this.togglePause())

    this.fsm.transitionTo('StageStart')
    this.fsm.transitionTo('Playing')
    this.startNextStage()

    installTestHooks(this)
  }

  override update(_time: number, deltaMs: number): void {
    if (this.fsm.getState() === 'Paused') return
    if (this.fsm.getState() === 'StageResult') return
    this.background.update(deltaMs, this.ship.x, this.ship.y)
    this.bullets.update(deltaMs)
    this.spawner.update(deltaMs)
    this.spawner.step(deltaMs)
    this.enemyAttack.update(this.spawner.getActiveEnemies())
    this.boss.update(deltaMs)
    this.control.update(deltaMs)
    this.autoAttack.update(deltaMs)
    this.collision.update()
    this.damage.update(deltaMs)
    this.stage.update(deltaMs)
    this.run.survivalTime += deltaMs / 1000

    const stage = this.stage.getCurrentStage()
    if (stage) {
      this.hud.setTimer(this.stage.getElapsedSeconds(), stage.duration)
    }
    this.hud.setHp(this.ship.stats.hp, this.ship.stats.maxHp)
    this.hud.setShield(this.ship.stats.shield, this.ship.stats.maxShield)
    this.hud.setMoney(this.money.total)

    const boss = this.boss.boss
    if (boss && boss.active) {
      this.hud.setBossHp(boss.hp, boss.maxHp)
    }
  }

  startNextStage(): void {
    const idx = this.run.currentStageIndex
    const stage = getStageByIndex(idx)
    if (!stage) {
      this.endGame(true)
      return
    }
    this.run.isStageCleared = false
    this.run.isBossActive = stage.type === 'boss'
    this.stage.startStage(idx)
  }

  advanceToNextStage(): void {
    this.run.currentStageIndex++
    if (this.run.currentStageIndex >= STAGE_TYPES.length) {
      this.endGame(true)
      return
    }
    this.fsm.force('Playing')
    this.startNextStage()
  }

  togglePause(): void {
    if (this.fsm.getState() === 'Paused') {
      this.resumeGame()
    } else if (this.fsm.getState() === 'Playing' || this.fsm.getState() === 'BossStage') {
      this.pauseGame()
    }
  }

  pauseGame(): void {
    if (this.pausePanel) return
    this.fsm.force('Paused')
    this.run.isPaused = true
    this.background.setPaused(true)
    this.pausePanel = new PausePanel(
      this,
      () => this.resumeGame(),
      () => this.exitToMenu(),
    )
  }

  resumeGame(): void {
    if (this.pausePanel) {
      this.pausePanel.destroy()
      this.pausePanel = null
    }
    this.fsm.force('Playing')
    this.run.isPaused = false
    this.background.setPaused(false)
  }

  exitToMenu(): void {
    if (this.pausePanel) {
      this.pausePanel.destroy()
      this.pausePanel = null
    }
    this.scene.start('Menu')
  }

  private handlePlayerDied(): void {
    this.run.isGameOver = true
    this.endGame(false)
  }

  private tryRevive(): boolean {
    const modules = this.build.getInstalledModules()
    let totalCharges = 0
    for (const m of modules) {
      for (const eff of m.effects) {
        if (eff.type === 'on_death_revive_once') {
          const used = this.run.reviveChargesUsed[m.id] ?? 0
          if (used < 1) {
            this.run.reviveChargesUsed[m.id] = used + 1
            totalCharges++
            return true
          }
        }
      }
    }
    return totalCharges > 0
  }

  private applyStageEndModuleEffects(): void {
    const modules = this.build.getInstalledModules()
    const heal = sumEffectValue(modules, 'on_stage_end_heal')
    if (heal > 0) {
      this.ship.stats.hp = Math.min(this.ship.stats.maxHp, this.ship.stats.hp + heal)
    }
  }

  private endGame(victory: boolean): void {
    this.save.update(data => {
      data.totalRuns++
      data.totalKills += this.run.totalKills
      data.bestSurvivalTime = Math.max(data.bestSurvivalTime, this.run.survivalTime)
      data.bestStageReached = Math.max(data.bestStageReached, this.run.currentStageIndex + 1)
      if (victory) data.clearCount++
      else data.deathCount++
    })
    if (victory) this.fsm.force('Victory')
    else this.fsm.force('Defeat')
    this.fsm.force('GameResult')
    this.scene.start('GameResult', { victory, run: this.run })
  }

  /** 选模块完成后,由 StageResultScene 调用. */
  applyChosenModuleAndAdvance(): void {
    const stats = this.build.recalc(this.ship.stats.hp)
    this.ship.setStats(stats)
    this.run.money = this.money.total
    this.advanceToNextStage()
  }

  /** 重新计算属性(模块/槽位变化时使用). */
  recalcStats(): void {
    const stats = this.build.recalc(this.ship.stats.hp)
    this.ship.setStats(stats)
  }
}
