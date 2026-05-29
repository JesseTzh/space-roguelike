import { getModuleById } from '../../data/moduleTypes'
import { createInitialSlots, findFirstEmptyUnlockedSlot, getInstalledModules, installModule, purchaseNextSlot } from '../../systems/ShipSlotSystem'

describe('ShipSlotSystem', () => {
  it('creates nine slots and unlocks first four', () => {
    const slots = createInitialSlots()
    expect(slots).toHaveLength(9)
    expect(slots.filter(slot => slot.unlocked)).toHaveLength(4)
  })

  it('installs module into unlocked slot', () => {
    const module = getModuleById('weapon_laser_1')!
    const slots = installModule(createInitialSlots(), 'slot_1', module)
    expect(getInstalledModules(slots)[0].id).toBe(module.id)
  })

  it('rejects locked slot installation', () => {
    const module = getModuleById('weapon_laser_1')!
    expect(() => installModule(createInitialSlots(), 'slot_5', module)).toThrow()
  })

  it('purchases next slot with money', () => {
    const result = purchaseNextSlot(createInitialSlots(), 100)
    expect(result.money).toBe(0)
    expect(result.slots.find(slot => slot.id === 'slot_5')?.unlocked).toBe(true)
  })

  it('finds empty unlocked slot', () => {
    expect(findFirstEmptyUnlockedSlot(createInitialSlots())?.id).toBe('slot_1')
  })
})
