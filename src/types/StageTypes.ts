export type StageType = 'normal' | 'boss'
export type SpawnPattern = 'top' | 'side' | 'diagonal' | 'random'

export interface StageWaveConfig {
  enemyId: string
  timeStart: number
  timeEnd: number
  spawnInterval: number
  maxAlive: number
  pattern: SpawnPattern
}

export interface StageConfig {
  id: string
  name: string
  type: StageType
  duration: number
  baseReward: number
  waves: StageWaveConfig[]
}
