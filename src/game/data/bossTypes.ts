export interface BossPatternConfig {
  name: 'straight' | 'spread' | 'aimed'
  interval: number
  bulletCount: number
  bulletDamage: number
  bulletSpeed: number
}

export interface BossConfig {
  id: string
  name: string
  hp: number
  contactDamage: number
  money: number
  texture: string
  patternCycle: BossPatternConfig[]
  patternStepInterval: number
}

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  boss_01: {
    id: 'boss_01',
    name: '巡航母舰',
    hp: 2000,
    contactDamage: 25,
    money: 100,
    texture: 'boss_carrier_01',
    patternCycle: [
      { name: 'straight', interval: 2000, bulletCount: 5, bulletDamage: 10, bulletSpeed: 360 },
      { name: 'straight', interval: 2000, bulletCount: 5, bulletDamage: 10, bulletSpeed: 360 },
      { name: 'spread', interval: 4000, bulletCount: 9, bulletDamage: 12, bulletSpeed: 320 },
      { name: 'aimed', interval: 5000, bulletCount: 3, bulletDamage: 15, bulletSpeed: 280 },
    ],
    patternStepInterval: 2200,
  },
}

export function getBossConfig(id: string): BossConfig | undefined {
  return BOSS_CONFIGS[id]
}
