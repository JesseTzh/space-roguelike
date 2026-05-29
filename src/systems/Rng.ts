export interface Rng {
  next(): number
  nextInt(minInclusive: number, maxExclusive: number): number
  pick<T>(items: T[]): T
}

export class Mulberry32Rng implements Rng {
  private seed: number

  constructor(seed = Date.now()) {
    this.seed = seed >>> 0
  }

  next(): number {
    let t = (this.seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  nextInt(minInclusive: number, maxExclusive: number): number {
    if (maxExclusive <= minInclusive) return minInclusive
    return Math.floor(this.next() * (maxExclusive - minInclusive)) + minInclusive
  }

  pick<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from an empty array')
    }
    return items[this.nextInt(0, items.length)]
  }
}

export class FixedRng implements Rng {
  private index = 0

  constructor(private readonly values: number[]) {}

  next(): number {
    if (this.values.length === 0) return 0
    const value = this.values[this.index % this.values.length]
    this.index += 1
    return Math.max(0, Math.min(0.999999, value))
  }

  nextInt(minInclusive: number, maxExclusive: number): number {
    if (maxExclusive <= minInclusive) return minInclusive
    return Math.floor(this.next() * (maxExclusive - minInclusive)) + minInclusive
  }

  pick<T>(items: T[]): T {
    if (items.length === 0) throw new Error('Cannot pick from an empty array')
    return items[this.nextInt(0, items.length)]
  }
}
