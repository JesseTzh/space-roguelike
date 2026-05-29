export interface Poolable {
  active: boolean
  spawn(x: number, y: number, data?: unknown): void
  despawn(): void
}

export class ObjectPool<T extends Poolable> {
  private items: T[] = []

  constructor(
    private createItem: () => T,
    initialSize: number,
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.items.push(this.createItem())
    }
  }

  get(): T {
    const item = this.items.find(i => !i.active)
    if (item) return item
    const newItem = this.createItem()
    this.items.push(newItem)
    return newItem
  }

  release(item: T): void {
    item.despawn()
  }

  releaseAll(): void {
    for (const item of this.items) {
      if (item.active) item.despawn()
    }
  }

  forEachActive(cb: (item: T) => void): void {
    for (const item of this.items) {
      if (item.active) cb(item)
    }
  }

  countActive(): number {
    let n = 0
    for (const item of this.items) {
      if (item.active) n++
    }
    return n
  }

  total(): number {
    return this.items.length
  }

  /** 只读视图, 用于测试. */
  getAll(): readonly T[] {
    return this.items
  }
}
