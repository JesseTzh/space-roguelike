import { getModuleById } from '../../data/moduleTypes'
import { PLAYER_BASE_STATS } from '../../data/playerBaseStats'
import { calculateFinalStats } from '../../systems/StatsCalculator'
import { createInitialSlots, getInstalledModules, installModule, purchaseNextSlot } from '../../systems/ShipSlotSystem'

describe('Module install flow', () => {
  it('installs, recalculates, buys slot and installs again', () => {
    const laser = getModuleById('weapon_laser_1')!
    const shield = getModuleById('shield_basic_1')!
    let slots = installModule(createInitialSlots(), 'slot_1', laser)
    let stats = calculateFinalStats(PLAYER_BASE_STATS, getInstalledModules(slots), PLAYER_BASE_STATS.hp)
    expect(stats.damage).toBeGreaterThan(PLAYER_BASE_STATS.damage)
    const bought = purchaseNextSlot(slots, 100)
    slots = installModule(bought.slots, 'slot_5', shield)
    stats = calculateFinalStats(stats, getInstalledModules(slots), stats.hp)
    expect(bought.money).toBe(0)
    expect(stats.maxShield).toBeGreaterThan(0)
  })
})
