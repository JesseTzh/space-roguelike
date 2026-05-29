import { describe, it, expect, beforeEach } from 'vitest'
import { StorageRepository, type StorageBackend } from '../../systems/StorageRepository'
import { SAVE_VERSION, createDefaultSave } from '../../types/SaveTypes'

class FakeBackend implements StorageBackend {
  private map = new Map<string, string>()
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null }
  setItem(k: string, v: string) { this.map.set(k, v) }
  removeItem(k: string) { this.map.delete(k) }
  has(k: string) { return this.map.has(k) }
}

describe('StorageRepository', () => {
  let backend: FakeBackend
  let repo: StorageRepository

  beforeEach(() => {
    backend = new FakeBackend()
    repo = new StorageRepository(backend)
  })

  it('returns default save when empty', () => {
    const data = repo.load()
    expect(data).toEqual(createDefaultSave())
  })

  it('save then load round trip', () => {
    const d = createDefaultSave()
    d.totalKills = 100
    d.bestSurvivalTime = 42.5
    d.settings.musicEnabled = false
    repo.save(d)
    const loaded = repo.load()
    expect(loaded.totalKills).toBe(100)
    expect(loaded.bestSurvivalTime).toBe(42.5)
    expect(loaded.settings.musicEnabled).toBe(false)
  })

  it('returns default for malformed json', () => {
    backend.setItem('space_roguelike_save_v1', 'not json{}')
    const data = repo.load()
    expect(data).toEqual(createDefaultSave())
  })

  it('normalizes negative numbers to 0', () => {
    backend.setItem('space_roguelike_save_v1', JSON.stringify({
      version: 1,
      totalKills: -5,
      bestSurvivalTime: -10,
    }))
    const data = repo.load()
    expect(data.totalKills).toBe(0)
    expect(data.bestSurvivalTime).toBe(0)
  })

  it('normalizes invalid types', () => {
    backend.setItem('space_roguelike_save_v1', JSON.stringify({
      version: 1,
      totalKills: 'abc',
      settings: { musicEnabled: 'yes' },
    }))
    const data = repo.load()
    expect(data.totalKills).toBe(0)
    expect(data.settings.musicEnabled).toBe(true) // fallback to default
  })

  it('reset removes data', () => {
    repo.save(createDefaultSave())
    expect(backend.has('space_roguelike_save_v1')).toBe(true)
    repo.reset()
    expect(backend.has('space_roguelike_save_v1')).toBe(false)
  })

  it('always writes current SAVE_VERSION', () => {
    backend.setItem('space_roguelike_save_v1', JSON.stringify({ version: 999, totalKills: 5 }))
    const data = repo.load()
    expect(data.version).toBe(SAVE_VERSION)
  })
})
