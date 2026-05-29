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
