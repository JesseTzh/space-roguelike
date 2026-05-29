export interface StageWaveConfig {
  enemyId: string
  timeStart: number
  timeEnd: number
  spawnInterval: number
  maxAlive: number
  pattern: 'top' | 'side' | 'diagonal' | 'random'
}

export interface StageConfig {
  id: string
  name: string
  type: 'normal' | 'boss'
  duration: number
  baseReward: number
  waves: StageWaveConfig[]
}
