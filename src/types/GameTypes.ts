import type { ShipSlot } from './ShipTypes'

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

export interface RunState {
  currentStageIndex: number
  money: number
  totalKills: number
  totalMoneyEarned: number
  survivalTime: number
  isPaused: boolean
  isGameOver: boolean
  isStageCleared: boolean
  isBossActive: boolean
  shipSlots: ShipSlot[]
  reviveChargesUsed: Record<string, number>
}

export interface StageRuntimeSummary {
  stageId: string
  stageName: string
  kills: number
  killMoney: number
  stageReward: number
  hp: number
}

export interface GameResultSummary {
  result: 'victory' | 'defeat'
  totalKills: number
  totalMoneyEarned: number
  survivalTime: number
  bestStageReached: number
  finalSlots: ShipSlot[]
}

export interface GameStateSnapshot {
  sceneKey: string
  gameState: GameState
  currentStageIndex: number
  money: number
  totalKills: number
  survivalTime: number
  stageRemaining: number
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
