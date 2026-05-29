import type { ShipModule, ModuleEffect } from '../types/ModuleTypes'

/**
 * 收集事件型模块效果(返回模块列表与该效果的总值/触发次数).
 * - on_stage_end_heal: 总治疗量为所有同效果模块 value 之和
 * - on_death_revive_once: 总复活次数 = 模块数量(每个模块只能触发 1 次)
 * - on_shield_break_clear_enemy_bullets: 触发开关
 */
export function sumEffectValue(modules: readonly ShipModule[], type: ModuleEffect['type']): number {
  let total = 0
  for (const m of modules) {
    for (const e of m.effects) {
      if (e.type === type) total += e.value
    }
  }
  return total
}

export function countModulesWithEffect(
  modules: readonly ShipModule[],
  type: ModuleEffect['type'],
): number {
  let n = 0
  for (const m of modules) {
    if (m.effects.some(e => e.type === type)) n++
  }
  return n
}
