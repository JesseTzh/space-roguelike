import { STAGE_TYPES } from '../data/stageTypes'
import type { GameState, RunState } from '../types/GameTypes'
import type { StageConfig } from '../types/StageTypes'

export function getCurrentStage(run: RunState, stages: StageConfig[] = STAGE_TYPES): StageConfig {
  return stages[Math.max(0, Math.min(stages.length - 1, run.currentStageIndex))]
}

export function isFinalStage(run: RunState, stages: StageConfig[] = STAGE_TYPES): boolean {
  return run.currentStageIndex >= stages.length - 1
}

export function getStateForStage(stage: StageConfig): GameState {
  return stage.type === 'boss' ? 'BossStage' : 'Playing'
}

export function advanceStage(run: RunState, stages: StageConfig[] = STAGE_TYPES): RunState {
  const nextIndex = Math.min(stages.length - 1, run.currentStageIndex + 1)
  return {
    ...run,
    currentStageIndex: nextIndex,
    isStageCleared: false,
    isBossActive: stages[nextIndex]?.type === 'boss'
  }
}

export function shouldSpawnWave(stage: StageConfig, elapsedSeconds: number, waveIndex: number, aliveCount: number): boolean {
  const wave = stage.waves[waveIndex]
  if (!wave) return false
  return elapsedSeconds >= wave.timeStart && elapsedSeconds <= wave.timeEnd && aliveCount < wave.maxAlive
}
