import type { PlayerShip } from '../entities/PlayerShip'
import type { PlayerStats } from '../types/PlayerTypes'
import type { ShipSlot } from '../types/ShipTypes'
import type { ShipModule } from '../types/ModuleTypes'
import { calculateFinalStats } from './StatsCalculator'
import { getInstalledModules, installModule, clearSlot, unlockNextSlot } from './SlotResolver'
import { createBasePlayerStats } from '../game/data/playerBaseStats'

interface ShipBuildContext {
  ship: PlayerShip
  slots: ShipSlot[]
  onStatsChanged: (stats: PlayerStats) => void
}

/**
 * 协调 ship 装配:模块安装/卸载/解锁槽位时,重新计算 stats 并应用到 ship.
 */
export class ShipBuildSystem {
  constructor(private ctx: ShipBuildContext) {}

  recalc(currentHp?: number): PlayerStats {
    const base = createBasePlayerStats()
    const modules = getInstalledModules(this.ctx.slots)
    const stats = calculateFinalStats(base, modules, currentHp ?? base.maxHp)
    this.ctx.ship.setStats(stats)
    this.ctx.onStatsChanged(stats)
    return stats
  }

  installToSlot(slotId: string, module: ShipModule): boolean {
    const ok = installModule(this.ctx.slots, slotId, module)
    if (!ok) return false
    const currentHp = this.ctx.ship.stats?.hp ?? createBasePlayerStats().maxHp
    this.recalc(currentHp)
    return true
  }

  removeFromSlot(slotId: string): boolean {
    const ok = clearSlot(this.ctx.slots, slotId)
    if (!ok) return false
    const currentHp = this.ctx.ship.stats?.hp ?? createBasePlayerStats().maxHp
    this.recalc(currentHp)
    return true
  }

  unlockNext(): { slotId: string; price: number } | null {
    const result = unlockNextSlot(this.ctx.slots)
    if (!result) return null
    const currentHp = this.ctx.ship.stats?.hp ?? createBasePlayerStats().maxHp
    this.recalc(currentHp)
    return result
  }

  getInstalledModules(): ShipModule[] {
    return getInstalledModules(this.ctx.slots)
  }
}
