import type { ShipModule } from '../types/ModuleTypes.js';
import type { ShipSlot } from '../types/ShipTypes.js';
export declare function createInitialSlots(): ShipSlot[];
export declare function getInstalledModules(slots: ShipSlot[]): ShipModule[];
export declare function installModule(slots: ShipSlot[], slotId: string, module: ShipModule): ShipSlot[];
export declare function getNextUnlockCost(slots: ShipSlot[]): number | undefined;
export declare function unlockNextSlot(slots: ShipSlot[], money: number): {
    slots: ShipSlot[];
    money: number;
    unlockedSlotId?: string;
};
export declare function unlockAllSlots(slots: ShipSlot[]): ShipSlot[];
