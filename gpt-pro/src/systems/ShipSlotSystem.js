import { INITIAL_UNLOCKED_SLOT_COUNT, MAX_SLOT_COUNT, SLOT_UNLOCK_PRICES } from '../data/slotUnlocks.js';
export function createInitialSlots() {
    return Array.from({ length: MAX_SLOT_COUNT }, (_, index) => ({
        id: `slot_${index + 1}`,
        unlocked: index < INITIAL_UNLOCKED_SLOT_COUNT,
    }));
}
export function getInstalledModules(slots) {
    return slots.filter(slot => slot.unlocked && slot.module).map(slot => slot.module);
}
export function installModule(slots, slotId, module) {
    return slots.map(slot => {
        if (slot.id !== slotId)
            return slot;
        if (!slot.unlocked)
            throw new Error(`Cannot install into locked slot: ${slotId}`);
        return { ...slot, module };
    });
}
export function getNextUnlockCost(slots) {
    const unlockedCount = slots.filter(slot => slot.unlocked).length;
    const unlockIndex = unlockedCount - INITIAL_UNLOCKED_SLOT_COUNT;
    return SLOT_UNLOCK_PRICES[unlockIndex];
}
export function unlockNextSlot(slots, money) {
    const lockedSlot = slots.find(slot => !slot.unlocked);
    if (!lockedSlot)
        return { slots, money };
    const cost = getNextUnlockCost(slots);
    if (cost === undefined)
        return { slots, money };
    if (money < cost)
        throw new Error('Not enough money to unlock slot');
    return {
        money: money - cost,
        unlockedSlotId: lockedSlot.id,
        slots: slots.map(slot => (slot.id === lockedSlot.id ? { ...slot, unlocked: true } : slot)),
    };
}
export function unlockAllSlots(slots) {
    return slots.map(slot => ({ ...slot, unlocked: true }));
}
//# sourceMappingURL=ShipSlotSystem.js.map