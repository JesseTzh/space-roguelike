export interface EnemyAttackConfig {
  bulletDamage: number
  bulletSpeed: number
  fireInterval: number
  pattern: 'straight' | 'aimed' | 'spread'
}

export interface EnemyConfig {
  id: string
  name: string
  hp: number
  contactDamage: number
  moveSpeed: number
  money: number
  texture: string
  attack?: EnemyAttackConfig
}

export interface EnemySnapshot {
  id: string
  configId: string
  x: number
  y: number
  hp: number
  active: boolean
  isBoss: boolean
}

export interface BulletSnapshot {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  source: 'player' | 'enemy'
  active: boolean
}
