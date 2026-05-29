import type { Vector2Like } from '../types/GameTypes.js'
import { distanceSquared } from './MathUtils.js'

export interface Targetable extends Vector2Like {
  id: string
  active: boolean
  dead: boolean
  y: number
  createdAt: number
}

export function findNearestTarget(player: Vector2Like, targets: readonly Targetable[]): Targetable | undefined {
  let best: Targetable | undefined
  let bestDistance = Number.POSITIVE_INFINITY

  for (const target of targets) {
    if (!target.active || target.dead) continue
    const distance = distanceSquared(player, target)
    if (distance < bestDistance) {
      best = target
      bestDistance = distance
      continue
    }
    if (distance === bestDistance && best) {
      if (target.y > best.y || (target.y === best.y && target.createdAt < best.createdAt)) best = target
    }
  }

  return best
}
