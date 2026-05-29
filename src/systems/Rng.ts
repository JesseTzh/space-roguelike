export interface Rng {
  next(): number
  nextRange(min: number, max: number): number
  pick<T>(items: readonly T[]): T
}

export class SeededRng implements Rng {
  private state: number

  constructor(seed = 0x12345678) {
    this.state = seed >>> 0
  }

  setSeed(seed: number): void {
    this.state = seed >>> 0
  }

  next(): number {
    let x = this.state
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    this.state = x >>> 0
    return this.state / 0xffffffff
  }

  nextRange(min: number, max: number): number {
    return min + (max - min) * this.next()
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Cannot pick from empty list')
    const index = Math.min(items.length - 1, Math.floor(this.next() * items.length))
    return items[index]!
  }
}
