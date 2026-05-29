export interface Rng {
  nextFloat(): number
  nextInt(min: number, max: number): number
  pickWeighted<T>(items: T[], weights: number[]): T
  pick<T>(items: T[]): T
}

/** Mulberry32 seeded RNG, deterministic for tests */
export class SeededRng implements Rng {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
    if (this.state === 0) this.state = 1
  }

  nextFloat(): number {
    this.state |= 0
    this.state = (this.state + 0x6d2b79f5) | 0
    let t = this.state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min
  }

  pick<T>(items: T[]): T {
    if (items.length === 0) throw new Error('Rng.pick on empty array')
    return items[Math.floor(this.nextFloat() * items.length)]
  }

  pickWeighted<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) throw new Error('items and weights length mismatch')
    if (items.length === 0) throw new Error('Rng.pickWeighted on empty array')
    const total = weights.reduce((s, w) => s + Math.max(0, w), 0)
    if (total <= 0) return items[0]
    let r = this.nextFloat() * total
    for (let i = 0; i < items.length; i++) {
      r -= Math.max(0, weights[i])
      if (r <= 0) return items[i]
    }
    return items[items.length - 1]
  }
}

export class MathRng implements Rng {
  nextFloat(): number {
    return Math.random()
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min
  }
  pick<T>(items: T[]): T {
    return items[Math.floor(this.nextFloat() * items.length)]
  }
  pickWeighted<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((s, w) => s + Math.max(0, w), 0)
    if (total <= 0) return items[0]
    let r = this.nextFloat() * total
    for (let i = 0; i < items.length; i++) {
      r -= Math.max(0, weights[i])
      if (r <= 0) return items[i]
    }
    return items[items.length - 1]
  }
}
