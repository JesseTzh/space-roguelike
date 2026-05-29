export interface PlayerStats {
  maxHp: number
  hp: number
  maxShield: number
  shield: number
  shieldRegen: number
  moveSpeed: number
  damage: number
  fireRate: number
  bulletSpeed: number
  bulletCount: number
  bulletSpread: number
  critRate: number
  critDamage: number
  moneyBonus: number
}

export interface PlayerRuntimeState {
  invincibleMs: number
  shieldWasPositive: boolean
  dead: boolean
}
