import type { PlayerStats } from '../types/PlayerTypes'

export interface DamageResult {
  shieldDamage: number
  hpDamage: number
  hpAfter: number
  shieldAfter: number
  /** 护盾从 >0 变为 0 时为 true */
  shieldBroken: boolean
  /** 玩家死亡(hp 归零) */
  died: boolean
}

export function applyDamageToPlayer(
  stats: Pick<PlayerStats, 'hp' | 'maxHp' | 'shield' | 'maxShield'>,
  damage: number,
): DamageResult {
  if (damage <= 0) {
    return {
      shieldDamage: 0,
      hpDamage: 0,
      hpAfter: stats.hp,
      shieldAfter: stats.shield,
      shieldBroken: false,
      died: stats.hp <= 0,
    }
  }
  const shieldBefore = stats.shield
  const shieldDamage = Math.min(stats.shield, damage)
  stats.shield -= shieldDamage
  const hpDamage = damage - shieldDamage
  stats.hp = Math.max(0, stats.hp - hpDamage)

  return {
    shieldDamage,
    hpDamage,
    hpAfter: stats.hp,
    shieldAfter: stats.shield,
    shieldBroken: shieldBefore > 0 && stats.shield === 0,
    died: stats.hp <= 0,
  }
}

export function rollCrit(damage: number, critRate: number, critDamage: number, roll: number): {
  damage: number
  isCrit: boolean
} {
  const isCrit = roll < critRate
  return {
    damage: isCrit ? damage * critDamage : damage,
    isCrit,
  }
}

export function regenShield(
  stats: Pick<PlayerStats, 'shield' | 'maxShield' | 'shieldRegen' | 'hp'>,
  deltaSeconds: number,
): void {
  if (stats.hp <= 0) return
  if (stats.shieldRegen <= 0) return
  if (stats.maxShield <= 0) return
  stats.shield = Math.min(stats.maxShield, stats.shield + stats.shieldRegen * deltaSeconds)
}
