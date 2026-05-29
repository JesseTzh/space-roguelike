import type { ShipModule } from '../types/ModuleTypes'
import type { PlayerStats } from '../types/PlayerTypes'

export interface PlayerDamageState {
  stats: PlayerStats
  invincibleUntilMs: number
  nowMs: number
  alive: boolean
  shieldBreakReady: boolean
  reviveChargesUsed: Record<string, number>
}

export interface DamageResult {
  state: PlayerDamageState
  hpDamage: number
  shieldDamage: number
  killed: boolean
  revived: boolean
  shieldBroken: boolean
  ignored: boolean
}

export function createDamageState(stats: PlayerStats): PlayerDamageState {
  return {
    stats: { ...stats },
    invincibleUntilMs: 0,
    nowMs: 0,
    alive: stats.hp > 0,
    shieldBreakReady: stats.shield > 0,
    reviveChargesUsed: {}
  }
}

export function applyDamageToPlayer(
  state: PlayerDamageState,
  damage: number,
  modules: ShipModule[] = [],
  invincibleMs = 600
): DamageResult {
  const next: PlayerDamageState = {
    ...state,
    stats: { ...state.stats },
    reviveChargesUsed: { ...state.reviveChargesUsed }
  }

  if (!next.alive || next.nowMs < next.invincibleUntilMs) {
    return { state: next, hpDamage: 0, shieldDamage: 0, killed: false, revived: false, shieldBroken: false, ignored: true }
  }

  const shieldBefore = next.stats.shield
  const shieldDamage = Math.min(next.stats.shield, Math.max(0, damage))
  next.stats.shield -= shieldDamage

  const hpDamage = Math.max(0, damage - shieldDamage)
  next.stats.hp = Math.max(0, next.stats.hp - hpDamage)
  next.invincibleUntilMs = next.nowMs + invincibleMs

  const shieldBroken = shieldBefore > 0 && next.stats.shield <= 0 && next.shieldBreakReady
  next.shieldBreakReady = next.stats.shield <= 0 ? false : next.shieldBreakReady

  let revived = false
  let killed = next.stats.hp <= 0

  if (killed) {
    const reviveModules = modules.filter(module => module.effects.some(effect => effect.type === 'on_death_revive_once'))
    for (const module of reviveModules) {
      const used = next.reviveChargesUsed[module.id] ?? 0
      if (used < 1) {
        const reviveEffect = module.effects.find(effect => effect.type === 'on_death_revive_once')
        const hpPercent = reviveEffect?.value ?? 0.3
        next.stats.hp = Math.max(1, Math.floor(next.stats.maxHp * hpPercent))
        next.reviveChargesUsed[module.id] = used + 1
        killed = false
        revived = true
        break
      }
    }
  }

  next.alive = !killed

  return { state: next, hpDamage, shieldDamage, killed, revived, shieldBroken, ignored: false }
}

export function regenerateShield(stats: PlayerStats, deltaSeconds: number): PlayerStats {
  const next = { ...stats }
  if (next.hp <= 0 || next.maxShield <= 0 || next.shieldRegen <= 0) return next
  next.shield = Math.min(next.maxShield, next.shield + next.shieldRegen * deltaSeconds)
  return next
}
