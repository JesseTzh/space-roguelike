import type { BulletSnapshot, EnemySnapshot } from '../../types/EnemyTypes'
import type { GameRuntimeMetrics, GameStateSnapshot } from '../../types/GameTypes'
import type { PlayerSnapshot } from '../../types/PlayerTypes'

export interface TestRunOptions {
  stageId: string
}

export interface TestEnemyOptions {
  enemyId?: string
  x?: number
  y?: number
}

export interface TestBossOptions {
  hp?: number
}

export interface MvpTestHooks {
  getStateSnapshot(): GameStateSnapshot
  getPlayerSnapshot(): PlayerSnapshot
  getEnemySnapshots(): EnemySnapshot[]
  getBulletSnapshots(): BulletSnapshot[]
  getMetrics(): GameRuntimeMetrics
  setRngSeed(seed: number): void
  startNewRun(options?: Partial<TestRunOptions>): void
  jumpToStage(stageId: string): void
  fastForward(ms: number): Promise<void>
  setPlayerHp(hp: number): void
  setPlayerShield(shield: number): void
  addMoney(amount: number): void
  unlockAllSlots(): void
  spawnEnemy(options: TestEnemyOptions): string
  spawnBoss(options?: Partial<TestBossOptions>): string
  clearEnemies(): void
  clearBullets(): void
  forceStageTimer(seconds: number): void
  forceModuleChoices(moduleIds: string[]): void
  selectModule(moduleId: string): void
  installModule(slotId: string): void
}

declare global {
  interface Window {
    __MVP_TEST__?: MvpTestHooks
  }
}

export {}
