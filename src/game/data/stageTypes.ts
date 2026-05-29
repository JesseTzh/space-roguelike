import type { StageConfig } from '../../types/StageTypes'

export const STAGE_TYPES: StageConfig[] = [
  {
    id: 'stage_01',
    name: '外围巡航区',
    type: 'normal',
    duration: 60,
    baseReward: 80,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 60,
        spawnInterval: 1200,
        maxAlive: 12,
        pattern: 'top',
      },
    ],
  },
  {
    id: 'stage_02',
    name: '碎星带',
    type: 'normal',
    duration: 75,
    baseReward: 100,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 75,
        spawnInterval: 1000,
        maxAlive: 16,
        pattern: 'top',
      },
      {
        enemyId: 'enemy_fast',
        timeStart: 20,
        timeEnd: 75,
        spawnInterval: 1600,
        maxAlive: 8,
        pattern: 'side',
      },
    ],
  },
  {
    id: 'stage_03',
    name: '陨石带',
    type: 'normal',
    duration: 90,
    baseReward: 120,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 90,
        spawnInterval: 900,
        maxAlive: 14,
        pattern: 'top',
      },
      {
        enemyId: 'enemy_heavy',
        timeStart: 15,
        timeEnd: 90,
        spawnInterval: 4500,
        maxAlive: 4,
        pattern: 'top',
      },
    ],
  },
  {
    id: 'stage_04',
    name: '前哨防御区',
    type: 'normal',
    duration: 90,
    baseReward: 150,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 90,
        spawnInterval: 800,
        maxAlive: 18,
        pattern: 'top',
      },
      {
        enemyId: 'enemy_fast',
        timeStart: 0,
        timeEnd: 90,
        spawnInterval: 1300,
        maxAlive: 10,
        pattern: 'diagonal',
      },
      {
        enemyId: 'enemy_heavy',
        timeStart: 30,
        timeEnd: 90,
        spawnInterval: 3500,
        maxAlive: 5,
        pattern: 'top',
      },
    ],
  },
  {
    id: 'stage_05',
    name: '母舰拦截战',
    type: 'boss',
    duration: 120,
    baseReward: 0,
    waves: [],
  },
]

export function getStageByIndex(index: number): StageConfig | undefined {
  return STAGE_TYPES[index]
}

export const TOTAL_STAGES = STAGE_TYPES.length
export const NORMAL_STAGES = STAGE_TYPES.filter(s => s.type === 'normal').length
