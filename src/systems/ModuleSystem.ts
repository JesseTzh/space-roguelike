import { MODULE_RARITY_WEIGHT, MODULE_TYPES } from '../data/moduleTypes.js'
import type { ShipModule } from '../types/ModuleTypes.js'
import type { Rng } from './Rng.js'

export function chooseWeightedModule(rng: Rng, pool: readonly ShipModule[] = MODULE_TYPES): ShipModule {
  const total = pool.reduce((sum, module) => sum + MODULE_RARITY_WEIGHT[module.rarity], 0)
  let cursor = rng.nextRange(0, total)
  for (const module of pool) {
    cursor -= MODULE_RARITY_WEIGHT[module.rarity]
    if (cursor <= 0) return module
  }
  return pool[pool.length - 1]!
}

export function rollModuleChoices(rng: Rng, count = 3, pool: readonly ShipModule[] = MODULE_TYPES): ShipModule[] {
  const choices: ShipModule[] = []
  const guardLimit = pool.length * 5
  let guard = 0

  while (choices.length < Math.min(count, pool.length) && guard < guardLimit) {
    const candidate = chooseWeightedModule(rng, pool)
    if (!choices.some(item => item.id === candidate.id)) choices.push(candidate)
    guard += 1
  }

  for (const candidate of pool) {
    if (choices.length >= Math.min(count, pool.length)) break
    if (!choices.some(item => item.id === candidate.id)) choices.push(candidate)
  }

  return choices
}

export function countEventModules(modules: readonly ShipModule[], effectType: ShipModule['effects'][number]['type']): number {
  return modules.reduce((sum, module) => sum + module.effects.filter(effect => effect.type === effectType).length, 0)
}

export function getStageEndHealAmount(modules: readonly ShipModule[]): number {
  return modules.reduce((sum, module) => {
    return sum + module.effects.filter(effect => effect.type === 'on_stage_end_heal').reduce((inner, effect) => inner + effect.value, 0)
  }, 0)
}

export function getReviveEffects(modules: readonly ShipModule[]): { moduleId: string; healPercent: number }[] {
  const result: { moduleId: string; healPercent: number }[] = []
  for (const module of modules) {
    for (const effect of module.effects) {
      if (effect.type === 'on_death_revive_once') result.push({ moduleId: module.id, healPercent: effect.value })
    }
  }
  return result
}

export function hasShieldBurst(modules: readonly ShipModule[]): boolean {
  return modules.some(module => module.effects.some(effect => effect.type === 'on_shield_break_clear_enemy_bullets'))
}
