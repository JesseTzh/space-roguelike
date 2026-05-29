import type { ModuleRarity, ShipModule } from '../types/ModuleTypes.js';
export declare const MODULE_RARITY_WEIGHT: Record<ModuleRarity, number>;
export declare const MODULE_TYPES: ShipModule[];
export declare function getModuleById(id: string): ShipModule;
