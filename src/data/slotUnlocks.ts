export interface SlotUnlockCost {
  slotId: string
  cost: number
}

export const SLOT_UNLOCKS: SlotUnlockCost[] = [
  { slotId: 'slot_5', cost: 100 },
  { slotId: 'slot_6', cost: 180 },
  { slotId: 'slot_7', cost: 280 },
  { slotId: 'slot_8', cost: 420 },
  { slotId: 'slot_9', cost: 600 }
]
