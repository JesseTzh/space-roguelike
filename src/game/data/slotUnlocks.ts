import type { ShipSlot } from '../../types/ShipTypes'

export const TOTAL_SLOTS = 9
export const INITIAL_UNLOCKED_SLOTS = 4

export const SLOT_UNLOCK_PRICES: number[] = [100, 180, 280, 420, 600]

export function createInitialSlots(): ShipSlot[] {
  const slots: ShipSlot[] = []
  for (let i = 1; i <= TOTAL_SLOTS; i++) {
    slots.push({
      id: `slot_${i}`,
      unlocked: i <= INITIAL_UNLOCKED_SLOTS,
      module: undefined,
    })
  }
  return slots
}

export function getNextSlotPrice(currentUnlockedCount: number): number | null {
  const lockedIndex = currentUnlockedCount - INITIAL_UNLOCKED_SLOTS
  if (lockedIndex < 0 || lockedIndex >= SLOT_UNLOCK_PRICES.length) return null
  return SLOT_UNLOCK_PRICES[lockedIndex]
}
