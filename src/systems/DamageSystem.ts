import type { ShipModule } from '../types/ModuleTypes.js'
import type { PlayerStats, PlayerRuntimeState } from '../types/PlayerTypes.js'
import { INVINCIBLE_MS } from '../game/constants.js'
import { getReviveEffects, hasShieldBurst } from './ModuleSystem.js'

export interface DamageResult {
  applied: boolean
  shieldDamage: number
  hpDamage: number
  dead: boolean
  shieldBroke: boolean
  revived: boolean
}

export function createPlayerRuntimeState(stats: PlayerStats): PlayerRuntimeState {
  return {
    invincibleMs: 0,
    shieldWasPositive: stats.shield > 0,
    dead: false,
  }
}

export function updatePlayerRuntime(state: PlayerRuntimeState, deltaMs: number, stats: PlayerStats): void {
  state.invincibleMs = Math.max(0, state.invincibleMs - deltaMs)
  if (stats.shield > 0) state.shieldWasPositive = true
}

export function applyDamageToPlayer(
  player: PlayerStats,
  runtime: PlayerRuntimeState,
  damage: number,
  modules: readonly ShipModule[] = [],
  reviveChargesUsed: Record<string, number> = {},
): DamageResult {
  if (runtime.dead || player.hp <= 0) return { applied: false, shieldDamage: 0, hpDamage: 0, dead: true, shieldBroke: false, revived: false }
  if (runtime.invincibleMs > 0) return { applied: false, shieldDamage: 0, hpDamage: 0, dead: false, shieldBroke: false, revived: false }

  const shieldBefore = player.shield
  const shieldDamage = Math.min(player.shield, damage)
  player.shield -= shieldDamage

  const hpDamage = Math.max(0, damage - shieldDamage)
  player.hp = Math.max(0, player.hp - hpDamage)

  const shieldBroke = shieldBefore > 0 && player.shield <= 0 && hasShieldBurst(modules)
  runtime.invincibleMs = INVINCIBLE_MS
  runtime.shieldWasPositive = player.shield > 0

  let revived = false
  if (player.hp <= 0) {
    for (const revive of getReviveEffects(modules)) {
      const used = reviveChargesUsed[revive.moduleId] ?? 0
      if (used <= 0) {
        reviveChargesUsed[revive.moduleId] = used + 1
        player.hp = Math.max(1, Math.floor(player.maxHp * revive.healPercent))
        runtime.dead = false
        revived = true
        break
      }
    }
  }

  runtime.dead = player.hp <= 0
  return { applied: true, shieldDamage, hpDamage, dead: runtime.dead, shieldBroke, revived }
}

export function regenerateShield(player: PlayerStats, deltaSeconds: number): void {
  if (player.hp <= 0 || player.maxShield <= 0 || player.shieldRegen <= 0) return
  player.shield = Math.min(player.maxShield, player.shield + player.shieldRegen * deltaSeconds)
}
