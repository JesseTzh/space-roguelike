import { PLAYER_BASE_STATS } from '../data/playerBaseStats'
import { createInitialSlots } from '../systems/ShipSlotSystem'
import type { GameResultSummary, RunState, StageRuntimeSummary } from '../types/GameTypes'
import type { PlayerStats } from '../types/PlayerTypes'
import type { ShipModule } from '../types/ModuleTypes'

export interface CurrentRunContext {
  run: RunState
  playerStats: PlayerStats
  lastStageSummary?: StageRuntimeSummary
  moduleChoices: ShipModule[]
  selectedModule?: ShipModule
  result?: GameResultSummary
}

export function createNewRunContext(): CurrentRunContext {
  return {
    run: {
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
      reviveChargesUsed: {}
    },
    playerStats: { ...PLAYER_BASE_STATS },
    moduleChoices: []
  }
}

export const RunContext: { current: CurrentRunContext } = {
  current: createNewRunContext()
}

export function resetRunContext(): CurrentRunContext {
  RunContext.current = createNewRunContext()
  return RunContext.current
}
