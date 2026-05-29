import type { ShipModule } from '../types/ModuleTypes'
import { MODULE_TYPES, RARITY_WEIGHTS } from '../game/data/moduleTypes'
import type { Rng } from './Rng'
import { MODULE_CHOICE_COUNT } from '../game/constants'

/**
 * 三选一: 不重复模块, 按稀有度权重随机.
 * 池中模块不足 N 个时返回实际可用数量.
 */
export function rollModuleChoices(
  rng: Rng,
  count: number = MODULE_CHOICE_COUNT,
  pool: ShipModule[] = MODULE_TYPES,
): ShipModule[] {
  const available = [...pool]
  const result: ShipModule[] = []
  const targetCount = Math.min(count, available.length)

  for (let i = 0; i < targetCount; i++) {
    const weights = available.map(m => RARITY_WEIGHTS[m.rarity] ?? 1)
    const picked = rng.pickWeighted(available, weights)
    result.push(picked)
    const idx = available.indexOf(picked)
    if (idx >= 0) available.splice(idx, 1)
  }

  return result
}
