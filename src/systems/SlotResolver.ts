import type { ShipModule } from '../types/ModuleTypes'
import type { ShipSlot } from '../types/ShipTypes'
import { getNextSlotPrice } from '../game/data/slotUnlocks'

export function getInstalledModules(slots: readonly ShipSlot[]): ShipModule[] {
  return slots
    .filter(s => s.unlocked && s.module)
    .map(s => s.module!)
}

export function findFirstEmptyUnlockedSlot(slots: readonly ShipSlot[]): ShipSlot | undefined {
  return slots.find(s => s.unlocked && !s.module)
}

export function hasEmptyUnlockedSlot(slots: readonly ShipSlot[]): boolean {
  return findFirstEmptyUnlockedSlot(slots) !== undefined
}

export function countUnlockedSlots(slots: readonly ShipSlot[]): number {
  return slots.filter(s => s.unlocked).length
}

/** 在原数组上安装模块到指定 slot, 返回是否成功 */
export function installModule(slots: ShipSlot[], slotId: string, module: ShipModule): boolean {
  const slot = slots.find(s => s.id === slotId)
  if (!slot) return false
  if (!slot.unlocked) return false
  slot.module = module
  return true
}

export function clearSlot(slots: ShipSlot[], slotId: string): boolean {
  const slot = slots.find(s => s.id === slotId)
  if (!slot) return false
  if (!slot.unlocked) return false
  slot.module = undefined
  return true
}

export function unlockNextSlot(slots: ShipSlot[]): { slotId: string; price: number } | null {
  const unlockedCount = countUnlockedSlots(slots)
  const price = getNextSlotPrice(unlockedCount)
  if (price === null) return null
  const next = slots.find(s => !s.unlocked)
  if (!next) return null
  next.unlocked = true
  return { slotId: next.id, price }
}

export function nextUnlockPrice(slots: readonly ShipSlot[]): number | null {
  return getNextSlotPrice(countUnlockedSlots(slots))
}

export function canPurchaseSlot(slots: readonly ShipSlot[], money: number): boolean {
  const price = nextUnlockPrice(slots)
  if (price === null) return false
  return money >= price
}
