import type { GameState } from '../types/GameTypes'
import type { ShipSlot } from '../types/ShipTypes'
import { createInitialSlots } from './data/slotUnlocks'

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

export function createInitialRunState(): RunState {
  return {
    currentStageIndex: 0,
    money: 0,
    totalKills: 0,
    totalMoneyEarned: 0,
    survivalTime: 0,
    isPaused: false,
    isGameOver: false,
    isStageCleared: false,
    isBossActive: false,
    shipSlots: createInitialSlots(),
    reviveChargesUsed: {},
  }
}

export interface LastStageResult {
  stageId: string
  kills: number
  killMoney: number
  stageReward: number
  prevHp: number
  finalHpBonus: number
}

export interface RunMetaSnapshot {
  state: GameState
  run: RunState
  lastStageResult: LastStageResult | null
}
