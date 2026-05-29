import type { ShipModule } from '../types/ModuleTypes.js';
import type { Rng } from './Rng.js';
export declare function chooseWeightedModule(rng: Rng, pool?: readonly ShipModule[]): ShipModule;
export declare function rollModuleChoices(rng: Rng, count?: number, pool?: readonly ShipModule[]): ShipModule[];
export declare function countEventModules(modules: readonly ShipModule[], effectType: ShipModule['effects'][number]['type']): number;
export declare function getStageEndHealAmount(modules: readonly ShipModule[]): number;
export declare function getReviveEffects(modules: readonly ShipModule[]): {
    moduleId: string;
    healPercent: number;
}[];
export declare function hasShieldBurst(modules: readonly ShipModule[]): boolean;
