export type GameState =
  | 'Menu'
  | 'Preload'
  | 'StageStart'
  | 'Playing'
  | 'Paused'
  | 'StageCleared'
  | 'StageResult'
  | 'ModuleSelect'
  | 'SlotInstall'
  | 'NextStage'
  | 'BossStage'
  | 'Victory'
  | 'Defeat'
  | 'GameResult'

export interface GameSettings {
  musicEnabled: boolean
  sfxEnabled: boolean
  vibrationEnabled: boolean
}

export interface GameRuntimeMetrics {
  fps: number
  activeEnemies: number
  activePlayerBullets: number
  activeEnemyBullets: number
  pooledEnemies: number
  pooledPlayerBullets: number
  pooledEnemyBullets: number
  activeTimers: number
  currentSceneKey: string
  currentGameState: GameState
}
