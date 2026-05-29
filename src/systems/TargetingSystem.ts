import type { TargetSnapshot } from '../types/EnemyTypes'

export interface TargetPoint {
  x: number
  y: number
}

export function distanceSq(a: TargetPoint, b: TargetPoint): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

export function findNearestTarget(player: TargetPoint, targets: TargetSnapshot[]): TargetSnapshot | undefined {
  const candidates = targets.filter(target => target.active && !target.dead && target.inBounds)
  candidates.sort((a, b) => {
    const distanceDelta = distanceSq(player, a) - distanceSq(player, b)
    if (Math.abs(distanceDelta) > 0.0001) return distanceDelta
    if (a.y !== b.y) return b.y - a.y
    return a.createdAt - b.createdAt
  })
  return candidates[0]
}

export function getSpreadAngles(baseAngleRad: number, count: number, spreadDeg: number): number[] {
  if (count <= 1 || spreadDeg <= 0) return [baseAngleRad]
  const spreadRad = (spreadDeg * Math.PI) / 180
  const start = baseAngleRad - spreadRad / 2
  const step = spreadRad / (count - 1)
  return Array.from({ length: count }, (_, index) => start + index * step)
}
