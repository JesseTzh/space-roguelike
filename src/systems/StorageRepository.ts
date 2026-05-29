import type { SaveData } from '../types/SaveTypes'

export const SAVE_KEY = 'space_roguelike_save_v1'
export const SAVE_VERSION = 1

export function createDefaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    clearCount: 0,
    deathCount: 0,
    totalRuns: 0,
    totalKills: 0,
    bestSurvivalTime: 0,
    bestStageReached: 0,
    settings: {
      musicEnabled: true,
      sfxEnabled: true,
      vibrationEnabled: true
    }
  }
}

export class StorageRepository {
  constructor(private readonly storage: Storage | undefined = typeof localStorage === 'undefined' ? undefined : localStorage) {}

  load(): SaveData {
    if (!this.storage) return createDefaultSave()
    try {
      const raw = this.storage.getItem(SAVE_KEY)
      if (!raw) return createDefaultSave()
      const parsed = JSON.parse(raw) as SaveData
      if (!parsed || parsed.version !== SAVE_VERSION) return createDefaultSave()
      return {
        ...createDefaultSave(),
        ...parsed,
        settings: { ...createDefaultSave().settings, ...parsed.settings }
      }
    } catch {
      return createDefaultSave()
    }
  }

  save(data: SaveData): void {
    if (!this.storage) return
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(data))
    } catch {
      // localStorage may be blocked. The game remains playable without persistence.
    }
  }

  update(mutator: (data: SaveData) => SaveData): SaveData {
    const next = mutator(this.load())
    this.save(next)
    return next
  }
}
