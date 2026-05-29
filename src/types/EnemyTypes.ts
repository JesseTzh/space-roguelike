export type EnemyAttackPattern = 'straight' | 'aimed' | 'spread'

export interface EnemyAttackConfig {
  bulletDamage: number
  bulletSpeed: number
  fireInterval: number
  pattern: EnemyAttackPattern
}

export interface EnemyConfig {
  id: string
  name: string
  hp: number
  contactDamage: number
  moveSpeed: number
  money: number
  texture: string
  radius: number
  attack?: EnemyAttackConfig
}

export interface TargetSnapshot {
  id: string
  x: number
  y: number
  active: boolean
  dead: boolean
  inBounds: boolean
  createdAt: number
}

export interface EnemySnapshot extends TargetSnapshot {
  hp: number
  type: string
}

export interface BulletSnapshot {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  owner: 'player' | 'enemy'
  active: boolean
  targetId?: string
}
