import { ObjectPool, type Poolable } from '../../systems/ObjectPool'

class TestItem implements Poolable {
  active = false
  x = 0
  y = 0
  spawn(x: number, y: number): void { this.active = true; this.x = x; this.y = y }
  despawn(): void { this.active = false }
}

describe('ObjectPool', () => {
  it('reuses inactive items and grows when needed', () => {
    const pool = new ObjectPool(() => new TestItem(), 1)
    const first = pool.get()
    first.spawn(1, 2)
    expect(pool.activeCount).toBe(1)
    const second = pool.get()
    second.spawn(3, 4)
    expect(pool.total).toBe(2)
    pool.release(first)
    expect(pool.inactiveCount).toBe(1)
    const reused = pool.get()
    expect(reused).toBe(first)
  })
})
