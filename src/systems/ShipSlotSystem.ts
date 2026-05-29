import { SLOT_UNLOCKS } from '../data/slotUnlocks'
import type { ShipModule } from '../types/ModuleTypes'
import type { ShipSlot } from '../types/ShipTypes'

export function createInitialSlots(total = 9, unlocked = 4): ShipSlot[] {
  return Array.from({ length: total }, (_, index) => ({
    id: `slot_${index + 1}`,
    unlocked: index < unlocked
  }))
}

export function getInstalledModules(slots: ShipSlot[]): ShipModule[] {
  return slots.filter(slot => slot.unlocked && slot.module).map(slot => slot.module!)
}

export function installModule(slots: ShipSlot[], slotId: string, module: ShipModule): ShipSlot[] {
  return slots.map(slot => {
    if (slot.id !== slotId) return { ...slot }
    if (!slot.unlocked) throw new Error(`Slot ${slotId} is locked`)
    return { ...slot, module }
  })
}

export function findFirstEmptyUnlockedSlot(slots: ShipSlot[]): ShipSlot | undefined {
  return slots.find(slot => slot.unlocked && !slot.module)
}

export function getNextUnlockCost(slots: ShipSlot[]): { slotId: string, cost: number } | undefined {
  const locked = slots.find(slot => !slot.unlocked)
  if (!locked) return undefined
  return SLOT_UNLOCKS.find(item => item.slotId === locked.id)
}

export function purchaseNextSlot(slots: ShipSlot[], money: number): { slots: ShipSlot[], money: number, unlockedSlotId?: string, cost?: number } {
  const next = getNextUnlockCost(slots)
  if (!next || money < next.cost) {
    return { slots: slots.map(slot => ({ ...slot })), money }
  }

  return {
    slots: slots.map(slot => slot.id === next.slotId ? { ...slot, unlocked: true } : { ...slot }),
    money: money - next.cost,
    unlockedSlotId: next.slotId,
    cost: next.cost
  }
}
