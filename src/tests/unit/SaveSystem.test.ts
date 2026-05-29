import { describe, it, expect } from 'vitest'
import { SaveSystem } from '../../systems/SaveSystem'
import { StorageRepository, type StorageBackend } from '../../systems/StorageRepository'

class FakeBackend implements StorageBackend {
  private map = new Map<string, string>()
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null }
  setItem(k: string, v: string) { this.map.set(k, v) }
  removeItem(k: string) { this.map.delete(k) }
}

describe('SaveSystem', () => {
  it('load returns default', () => {
    const repo = new StorageRepository(new FakeBackend())
    const sys = new SaveSystem(repo)
    expect(sys.load().totalKills).toBe(0)
  })

  it('update mutates and persists', () => {
    const backend = new FakeBackend()
    const repo = new StorageRepository(backend)
    const sys = new SaveSystem(repo)
    sys.update(d => {
      d.totalKills = 50
      d.bestSurvivalTime = 30
    })
    const sys2 = new SaveSystem(new StorageRepository(backend))
    expect(sys2.load().totalKills).toBe(50)
    expect(sys2.load().bestSurvivalTime).toBe(30)
  })

  it('reset clears cache and storage', () => {
    const backend = new FakeBackend()
    const repo = new StorageRepository(backend)
    const sys = new SaveSystem(repo)
    sys.update(d => { d.totalKills = 5 })
    sys.reset()
    expect(sys.load().totalKills).toBe(0)
  })
})
