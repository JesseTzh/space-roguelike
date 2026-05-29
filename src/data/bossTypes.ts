export interface BossPatternConfig {
  id: string
  name: string
  interval: number
  bulletCount: number
  bulletDamage: number
  bulletSpeed: number
  spreadDeg: number
  kind: 'line' | 'spread' | 'aimed'
}

export const BOSS_PATTERNS: BossPatternConfig[] = [
  { id: 'line_1', name: '直线弹幕', interval: 2000, bulletCount: 5, bulletDamage: 10, bulletSpeed: 360, spreadDeg: 30, kind: 'line' },
  { id: 'line_2', name: '直线弹幕', interval: 2000, bulletCount: 5, bulletDamage: 10, bulletSpeed: 360, spreadDeg: 30, kind: 'line' },
  { id: 'spread_1', name: '扇形弹幕', interval: 4000, bulletCount: 9, bulletDamage: 12, bulletSpeed: 320, spreadDeg: 90, kind: 'spread' },
  { id: 'aimed_1', name: '追踪弹', interval: 5000, bulletCount: 3, bulletDamage: 15, bulletSpeed: 280, spreadDeg: 20, kind: 'aimed' }
]
