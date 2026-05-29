import { SAVE_KEY, StorageRepository } from '../../systems/StorageRepository'

describe('StorageRepository', () => {
  it('creates default save when empty', () => {
    const storage = window.localStorage
    storage.clear()
    const save = new StorageRepository(storage).load()
    expect(save.clearCount).toBe(0)
    expect(save.settings.musicEnabled).toBe(true)
  })

  it('saves and loads data', () => {
    const storage = window.localStorage
    storage.clear()
    const repo = new StorageRepository(storage)
    const data = repo.update(save => ({ ...save, clearCount: 2 }))
    expect(data.clearCount).toBe(2)
    expect(repo.load().clearCount).toBe(2)
  })

  it('ignores corrupted save', () => {
    window.localStorage.setItem(SAVE_KEY, 'not-json')
    expect(new StorageRepository(window.localStorage).load().totalRuns).toBe(0)
  })
})
