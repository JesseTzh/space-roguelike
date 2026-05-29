import { PLAYER_BASE_STATS } from '../../data/playerBaseStats'
import { createInitialSlots } from '../../systems/ShipSlotSystem'
import type { RunState } from '../../types/GameTypes'

export function createRunState(overrides: Partial<RunState> = {}): RunState {
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
    ...overrides
  }
}

export function createBaseStats() {
  return { ...PLAYER_BASE_STATS }
}
