import type { StageConfig, StageWaveConfig } from '../types/StageTypes'
import { STAGE_TYPES } from '../game/data/stageTypes'

export interface ActiveWave extends StageWaveConfig {
  /** 上次生成时间(ms,从波次激活开始计) */
  lastSpawnAt: number
  currentAlive: number
}

export function getStageList(): StageConfig[] {
  return STAGE_TYPES
}

export function getStage(index: number): StageConfig | undefined {
  return STAGE_TYPES[index]
}

export function isLastStage(index: number): boolean {
  return index === STAGE_TYPES.length - 1
}

export function isBossStage(index: number): boolean {
  const s = STAGE_TYPES[index]
  return !!s && s.type === 'boss'
}

/** 给定关卡进行时间(秒), 返回当前活跃波次的副本 */
export function getActiveWaves(stage: StageConfig, elapsedSeconds: number): StageWaveConfig[] {
  return stage.waves.filter(w => elapsedSeconds >= w.timeStart && elapsedSeconds < w.timeEnd)
}

export function isStageDurationReached(stage: StageConfig, elapsedSeconds: number): boolean {
  if (stage.type !== 'normal') return false
  return elapsedSeconds >= stage.duration
}
