import { describe, it, expect } from 'vitest'
import {
  getStageList,
  getStage,
  isLastStage,
  isBossStage,
  getActiveWaves,
  isStageDurationReached,
} from '../../systems/StageResolver'

describe('StageResolver', () => {
  it('getStageList returns 5 stages', () => {
    expect(getStageList()).toHaveLength(5)
  })

  it('getStage returns config or undefined', () => {
    expect(getStage(0)?.id).toBe('stage_01')
    expect(getStage(99)).toBeUndefined()
  })

  it('isLastStage correct for index 4', () => {
    expect(isLastStage(4)).toBe(true)
    expect(isLastStage(0)).toBe(false)
  })

  it('isBossStage correct for stage_05', () => {
    expect(isBossStage(4)).toBe(true)
    expect(isBossStage(0)).toBe(false)
  })

  it('getActiveWaves filters by time', () => {
    const stage = getStage(1)!
    const at0 = getActiveWaves(stage, 0)
    expect(at0.length).toBeGreaterThanOrEqual(1)
    const at1000 = getActiveWaves(stage, 1000)
    expect(at1000).toHaveLength(0)
  })

  it('isStageDurationReached only true for normal stages past duration', () => {
    const normal = getStage(0)!
    expect(isStageDurationReached(normal, 0)).toBe(false)
    expect(isStageDurationReached(normal, normal.duration)).toBe(true)
    const boss = getStage(4)!
    expect(isStageDurationReached(boss, 9999)).toBe(false)
  })
})
