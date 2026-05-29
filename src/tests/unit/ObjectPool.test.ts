import { describe, it, expect } from 'vitest'
import { ObjectPool, type Poolable } from '../../systems/ObjectPool'

class Item implements Poolable {
  active = false
  value = 0
  spawn(_x: number, _y: number, data?: unknown): void {
    this.active = true
    if (typeof data === 'number') this.value = data
  }
  despawn(): void {
    this.active = false
    this.value = 0
  }
}

describe('ObjectPool', () => {
  it('preallocates initial size', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 5)
    expect(pool.countActive()).toBe(0)
  })

  it('get activates an item', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 2)
    const it = pool.get()
    it.spawn(0, 0, 42)
    expect(pool.countActive()).toBe(1)
    expect(it.value).toBe(42)
  })

  it('reuses despawned items', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 1)
    const a = pool.get()
    a.spawn(0, 0, 1)
    a.despawn()
    const b = pool.get()
    expect(b).toBe(a)
  })

  it('grows beyond initial size', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 1)
    const items: Item[] = []
    for (let i = 0; i < 5; i++) {
      const it = pool.get()
      it.spawn(0, 0, i)
      items.push(it)
    }
    expect(pool.countActive()).toBe(5)
  })

  it('forEachActive only visits active', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 3)
    const a = pool.get(); a.spawn(0, 0, 1)
    const b = pool.get(); b.spawn(0, 0, 2)
    a.despawn()
    const visited: number[] = []
    pool.forEachActive(it => visited.push(it.value))
    expect(visited).toEqual([2])
  })

  it('releaseAll deactivates everything', () => {
    const pool = new ObjectPool<Item>(() => new Item(), 2)
    const a = pool.get(); a.spawn(0, 0, 1)
    const b = pool.get(); b.spawn(0, 0, 2)
    pool.releaseAll()
    expect(pool.countActive()).toBe(0)
  })
})
