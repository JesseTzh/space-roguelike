export interface SaveData {
  version: number

  clearCount: number
  deathCount: number
  totalRuns: number
  totalKills: number
  bestSurvivalTime: number
  bestStageReached: number

  settings: {
    musicEnabled: boolean
    sfxEnabled: boolean
    vibrationEnabled: boolean
  }
}

export const SAVE_VERSION = 1
export const SAVE_KEY = 'space_roguelike_save_v1'

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
      vibrationEnabled: true,
    },
  }
}
