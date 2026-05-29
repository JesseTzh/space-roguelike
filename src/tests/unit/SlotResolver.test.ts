import { describe, it, expect } from 'vitest'
import {
  installModule,
  clearSlot,
  unlockNextSlot,
  getInstalledModules,
  hasEmptyUnlockedSlot,
  countUnlockedSlots,
  nextUnlockPrice,
  canPurchaseSlot,
} from '../../systems/SlotResolver'
import { createInitialSlots } from '../../game/data/slotUnlocks'
import type { ShipModule } from '../../types/ModuleTypes'

const fakeMod: ShipModule = {
  id: 'fake',
  name: 'fake',
  description: '',
  category: 'weapon',
  rarity: 'common',
  effects: [],
}

describe('SlotResolver', () => {
  it('createInitialSlots: 9 total, first 4 unlocked', () => {
    const slots = createInitialSlots()
    expect(slots).toHaveLength(9)
    expect(countUnlockedSlots(slots)).toBe(4)
  })

  it('installModule succeeds in unlocked slot', () => {
    const slots = createInitialSlots()
    expect(installModule(slots, 'slot_1', fakeMod)).toBe(true)
    expect(slots[0].module).toBe(fakeMod)
  })

  it('installModule fails on locked slot', () => {
    const slots = createInitialSlots()
    expect(installModule(slots, 'slot_5', fakeMod)).toBe(false)
  })

  it('installModule fails on missing slot id', () => {
    const slots = createInitialSlots()
    expect(installModule(slots, 'slot_99', fakeMod)).toBe(false)
  })

  it('clearSlot removes module', () => {
    const slots = createInitialSlots()
    installModule(slots, 'slot_1', fakeMod)
    expect(clearSlot(slots, 'slot_1')).toBe(true)
    expect(slots[0].module).toBeUndefined()
  })

  it('unlockNextSlot unlocks slot 5 with price 100', () => {
    const slots = createInitialSlots()
    const r = unlockNextSlot(slots)
    expect(r).toEqual({ slotId: 'slot_5', price: 100 })
    expect(slots[4].unlocked).toBe(true)
  })

  it('unlockNextSlot returns null after all unlocked', () => {
    const slots = createInitialSlots()
    while (unlockNextSlot(slots)) {
      // unlock all
    }
    expect(countUnlockedSlots(slots)).toBe(9)
    expect(unlockNextSlot(slots)).toBe(null)
  })

  it('nextUnlockPrice progression: 100, 180, 280, 420, 600, then null', () => {
    const slots = createInitialSlots()
    const prices: (number | null)[] = []
    for (let i = 0; i < 6; i++) {
      prices.push(nextUnlockPrice(slots))
      unlockNextSlot(slots)
    }
    expect(prices).toEqual([100, 180, 280, 420, 600, null])
  })

  it('canPurchaseSlot reflects price', () => {
    const slots = createInitialSlots()
    expect(canPurchaseSlot(slots, 99)).toBe(false)
    expect(canPurchaseSlot(slots, 100)).toBe(true)
  })

  it('getInstalledModules only returns installed', () => {
    const slots = createInitialSlots()
    installModule(slots, 'slot_1', fakeMod)
    installModule(slots, 'slot_2', fakeMod)
    expect(getInstalledModules(slots)).toHaveLength(2)
  })

  it('hasEmptyUnlockedSlot reflects state', () => {
    const slots = createInitialSlots()
    expect(hasEmptyUnlockedSlot(slots)).toBe(true)
    for (let i = 1; i <= 4; i++) installModule(slots, `slot_${i}`, fakeMod)
    expect(hasEmptyUnlockedSlot(slots)).toBe(false)
  })
})
