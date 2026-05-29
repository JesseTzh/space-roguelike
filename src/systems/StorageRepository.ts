import type { SaveData } from '../types/SaveTypes'
import { SAVE_KEY, SAVE_VERSION, createDefaultSave } from '../types/SaveTypes'

export interface StorageBackend {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

class MemoryBackend implements StorageBackend {
  private map = new Map<string, string>()
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }
  removeItem(key: string): void {
    this.map.delete(key)
  }
}

function defaultBackend(): StorageBackend {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      const ls = (globalThis as any).localStorage as Storage
      const probeKey = '__probe_' + Math.random().toString(36).slice(2)
      ls.setItem(probeKey, '1')
      ls.removeItem(probeKey)
      return ls
    }
  } catch {
    // fall through
  }
  return new MemoryBackend()
}

export class StorageRepository {
  private backend: StorageBackend

  constructor(backend?: StorageBackend) {
    this.backend = backend ?? defaultBackend()
  }

  load(): SaveData {
    try {
      const raw = this.backend.getItem(SAVE_KEY)
      if (!raw) return createDefaultSave()
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return createDefaultSave()
      return this.normalize(parsed as Partial<SaveData>)
    } catch {
      return createDefaultSave()
    }
  }

  save(data: SaveData): void {
    try {
      this.backend.setItem(SAVE_KEY, JSON.stringify(data))
    } catch {
      // ignore quota or other errors
    }
  }

  reset(): void {
    try {
      this.backend.removeItem(SAVE_KEY)
    } catch {
      // ignore
    }
  }

  private normalize(input: Partial<SaveData>): SaveData {
    const def = createDefaultSave()
    return {
      version: SAVE_VERSION,
      clearCount: clampInt(input.clearCount, 0),
      deathCount: clampInt(input.deathCount, 0),
      totalRuns: clampInt(input.totalRuns, 0),
      totalKills: clampInt(input.totalKills, 0),
      bestSurvivalTime: clampNum(input.bestSurvivalTime, 0),
      bestStageReached: clampInt(input.bestStageReached, 0),
      settings: {
        musicEnabled: bool(input.settings?.musicEnabled, def.settings.musicEnabled),
        sfxEnabled: bool(input.settings?.sfxEnabled, def.settings.sfxEnabled),
        vibrationEnabled: bool(input.settings?.vibrationEnabled, def.settings.vibrationEnabled),
      },
    }
  }
}

function clampInt(v: unknown, fallback: number): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.floor(v) : fallback
  return Math.max(0, n)
}
function clampNum(v: unknown, fallback: number): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback
  return Math.max(0, n)
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}
