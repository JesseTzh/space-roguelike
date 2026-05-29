export interface TargetCandidate {
  id: string
  x: number
  y: number
  active: boolean
  alive: boolean
  /** 创建时间, 用于距离相同时的稳定排序 */
  createdAt: number
}

export function distanceSquared(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy
}

/**
 * 找到距离 (px,py) 最近的存活目标.
 * - 不考虑 inactive 或 dead.
 * - 距离相等时优先 y 更大(更靠近屏幕下方),其次 createdAt 更小(创建更早).
 */
export function findNearestTarget(
  px: number,
  py: number,
  candidates: readonly TargetCandidate[],
): TargetCandidate | null {
  let best: TargetCandidate | null = null
  let bestDist = Infinity
  for (const c of candidates) {
    if (!c.active || !c.alive) continue
    const d = distanceSquared(px, py, c.x, c.y)
    if (d < bestDist) {
      best = c
      bestDist = d
    } else if (d === bestDist && best) {
      if (c.y > best.y) {
        best = c
      } else if (c.y === best.y && c.createdAt < best.createdAt) {
        best = c
      }
    }
  }
  return best
}
