import type { ShipModule } from '../types/ModuleTypes.js'
import type { ShipSlot } from '../types/ShipTypes.js'
import { INITIAL_UNLOCKED_SLOT_COUNT, MAX_SLOT_COUNT, SLOT_UNLOCK_PRICES } from '../data/slotUnlocks.js'

export function createInitialSlots(): ShipSlot[] {
  return Array.from({ length: MAX_SLOT_COUNT }, (_, index) => ({
    id: `slot_${index + 1}`,
    unlocked: index < INITIAL_UNLOCKED_SLOT_COUNT,
  }))
}

export function getInstalledModules(slots: ShipSlot[]): ShipModule[] {
  return slots.filter(slot => slot.unlocked && slot.module).map(slot => slot.module!)
}

export function installModule(slots: ShipSlot[], slotId: string, module: ShipModule): ShipSlot[] {
  return slots.map(slot => {
    if (slot.id !== slotId) return slot
    if (!slot.unlocked) throw new Error(`Cannot install into locked slot: ${slotId}`)
    return { ...slot, module }
  })
}

export function getNextUnlockCost(slots: ShipSlot[]): number | undefined {
  const unlockedCount = slots.filter(slot => slot.unlocked).length
  const unlockIndex = unlockedCount - INITIAL_UNLOCKED_SLOT_COUNT
  return SLOT_UNLOCK_PRICES[unlockIndex]
}

export function unlockNextSlot(slots: ShipSlot[], money: number): { slots: ShipSlot[]; money: number; unlockedSlotId?: string } {
  const lockedSlot = slots.find(slot => !slot.unlocked)
  if (!lockedSlot) return { slots, money }

  const cost = getNextUnlockCost(slots)
  if (cost === undefined) return { slots, money }
  if (money < cost) throw new Error('Not enough money to unlock slot')

  return {
    money: money - cost,
    unlockedSlotId: lockedSlot.id,
    slots: slots.map(slot => (slot.id === lockedSlot.id ? { ...slot, unlocked: true } : slot)),
  }
}

export function unlockAllSlots(slots: ShipSlot[]): ShipSlot[] {
  return slots.map(slot => ({ ...slot, unlocked: true }))
}
