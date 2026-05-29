import { BOSS_PATTERNS, type BossPatternConfig } from '../data/bossTypes'

export function getBossPattern(sequenceIndex: number): BossPatternConfig {
  return BOSS_PATTERNS[sequenceIndex % BOSS_PATTERNS.length]
}

export function resolveBossAngles(pattern: BossPatternConfig, baseAngleRad: number): number[] {
  const count = pattern.bulletCount
  if (count <= 1) return [baseAngleRad]
  const spread = (pattern.spreadDeg * Math.PI) / 180
  const start = baseAngleRad - spread / 2
  const step = spread / (count - 1)
  return Array.from({ length: count }, (_, index) => start + step * index)
}
