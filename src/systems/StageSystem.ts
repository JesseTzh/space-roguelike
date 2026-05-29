import type { StageConfig } from '../types/StageTypes'
import type { EnemySpawner } from './EnemySpawner'
import type { BossSystem } from './BossSystem'
import type { BulletSystem } from './BulletSystem'
import { STAGE_TYPES, getStageByIndex } from '../game/data/stageTypes'
import { isStageDurationReached } from './StageResolver'

export interface StageEvents {
  onStageStart: (stage: StageConfig, index: number) => void
  onStageCleared: (stage: StageConfig, index: number) => void
  onAllStagesCleared: () => void
}

interface StageSystemContext {
  spawner: EnemySpawner
  boss: BossSystem
  bullets: BulletSystem
  events: StageEvents
}

export class StageSystem {
  enabled = true
  private currentIndex = -1
  private currentStage: StageConfig | null = null
  private elapsedSeconds = 0
  private isCleared = false
  private bossSpawned = false

  constructor(private ctx: StageSystemContext) {}

  startStage(index: number): boolean {
    const stage = getStageByIndex(index)
    if (!stage) return false
    this.currentIndex = index
    this.currentStage = stage
    this.elapsedSeconds = 0
    this.isCleared = false
    this.bossSpawned = false
    this.ctx.spawner.startStage(stage)
    if (stage.type === 'normal') {
      this.ctx.spawner.resume()
    } else {
      // boss 关:不启用普通敌人 spawner
      this.ctx.spawner.stop()
    }
    this.ctx.events.onStageStart(stage, index)
    return true
  }

  update(deltaMs: number): void {
    if (!this.enabled) return
    if (!this.currentStage) return
    if (this.isCleared) return
    this.elapsedSeconds += deltaMs / 1000
    const stage = this.currentStage
    if (stage.type === 'normal') {
      if (isStageDurationReached(stage, this.elapsedSeconds)) {
        this.markClear()
      }
    } else {
      // boss 关
      if (!this.bossSpawned) {
        this.ctx.boss.spawn('boss_01')
        this.bossSpawned = true
      }
      const boss = this.ctx.boss.boss
      if (boss && boss.hp <= 0) {
        this.markClear()
      }
    }
  }

  private markClear(): void {
    if (!this.currentStage) return
    this.isCleared = true
    this.ctx.spawner.stop()
    this.ctx.bullets.clearEnemyBullets()
    this.ctx.events.onStageCleared(this.currentStage, this.currentIndex)
    if (this.currentIndex >= STAGE_TYPES.length - 1) {
      this.ctx.events.onAllStagesCleared()
    }
  }

  getCurrentStage(): StageConfig | null {
    return this.currentStage
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }

  getElapsedSeconds(): number {
    return this.elapsedSeconds
  }

  isStageCleared(): boolean {
    return this.isCleared
  }

  reset(): void {
    this.currentIndex = -1
    this.currentStage = null
    this.elapsedSeconds = 0
    this.isCleared = false
    this.bossSpawned = false
  }
}
