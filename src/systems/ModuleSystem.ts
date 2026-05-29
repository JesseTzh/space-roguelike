import { MODULE_TYPES } from '../data/moduleTypes'
import type { Rng } from './Rng'
import { Mulberry32Rng } from './Rng'
import type { ModuleRarity, ShipModule } from '../types/ModuleTypes'
import { RARITY_WEIGHT } from '../types/ModuleTypes'

export function getRarityWeight(rarity: ModuleRarity): number {
  return RARITY_WEIGHT[rarity]
}

export function chooseWeightedModule(pool: ShipModule[], rng: Rng): ShipModule {
  const total = pool.reduce((sum, module) => sum + getRarityWeight(module.rarity), 0)
  let roll = rng.next() * total
  for (const module of pool) {
    roll -= getRarityWeight(module.rarity)
    if (roll <= 0) return module
  }
  return pool[pool.length - 1]
}

export function rollModuleChoices(count = 3, rng: Rng = new Mulberry32Rng(), pool: ShipModule[] = MODULE_TYPES): ShipModule[] {
  const candidates = [...pool]
  const result: ShipModule[] = []
  while (result.length < count && candidates.length > 0) {
    const module = chooseWeightedModule(candidates, rng)
    result.push(module)
    const index = candidates.findIndex(item => item.id === module.id)
    candidates.splice(index, 1)
  }
  return result
}
