export interface Poolable {
  active: boolean
  spawn(x: number, y: number, data?: unknown): void
  despawn(): void
}

export class ObjectPool<T extends Poolable> {
  private readonly items: T[] = []

  constructor(
    private readonly createItem: () => T,
    private readonly initialSize: number,
    private readonly maxSize = Number.POSITIVE_INFINITY,
  ) {
    for (let i = 0; i < initialSize; i += 1) {
      this.items.push(this.createItem())
    }
  }

  get(): T | undefined {
    const item = this.items.find(candidate => !candidate.active)
    if (item) return item

    if (this.items.length >= this.maxSize) return undefined

    const newItem = this.createItem()
    this.items.push(newItem)
    return newItem
  }

  release(item: T): void {
    item.despawn()
  }

  releaseAll(): void {
    for (const item of this.items) item.despawn()
  }

  get activeCount(): number {
    return this.items.filter(item => item.active).length
  }

  get totalCount(): number {
    return this.items.length
  }

  get allItems(): readonly T[] {
    return this.items
  }
}
