export interface Poolable {
  active: boolean
  spawn(x: number, y: number, data?: unknown): void
  despawn(): void
}

export class ObjectPool<T extends Poolable> {
  private readonly items: T[] = []

  constructor(private readonly createItem: () => T, private readonly initialSize: number) {
    for (let index = 0; index < initialSize; index += 1) {
      this.items.push(this.createItem())
    }
  }

  get(): T {
    const item = this.items.find(candidate => !candidate.active)
    if (item) return item
    const newItem = this.createItem()
    this.items.push(newItem)
    return newItem
  }

  release(item: T): void {
    item.despawn()
  }

  get total(): number {
    return this.items.length
  }

  get activeCount(): number {
    return this.items.filter(item => item.active).length
  }

  get inactiveCount(): number {
    return this.total - this.activeCount
  }

  all(): readonly T[] {
    return this.items
  }
}
