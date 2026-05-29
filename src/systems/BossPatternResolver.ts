import type { BossConfig, BossPatternConfig } from '../game/data/bossTypes'

export interface BossPatternState {
  cycleIndex: number
  timer: number
}

export function createInitialPatternState(): BossPatternState {
  return { cycleIndex: 0, timer: 0 }
}

/**
 * 推进 boss 弹幕循环计时, 当 timer 超过当前模式的 interval 时返回需要发射的 pattern, 并切换到下一个.
 */
export function tickBossPattern(
  state: BossPatternState,
  config: BossConfig,
  deltaMs: number,
): BossPatternConfig | null {
  state.timer += deltaMs
  const current = config.patternCycle[state.cycleIndex % config.patternCycle.length]
  if (state.timer >= current.interval) {
    state.timer -= current.interval
    state.cycleIndex = (state.cycleIndex + 1) % config.patternCycle.length
    return current
  }
  return null
}

/** 计算 spread 模式下的子弹角度数组 (rad) */
export function spreadAngles(centerRad: number, count: number, totalSpreadDeg: number): number[] {
  if (count <= 0) return []
  if (count === 1) return [centerRad]
  const totalRad = (totalSpreadDeg * Math.PI) / 180
  const step = totalRad / (count - 1)
  const start = centerRad - totalRad / 2
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    out.push(start + step * i)
  }
  return out
}
