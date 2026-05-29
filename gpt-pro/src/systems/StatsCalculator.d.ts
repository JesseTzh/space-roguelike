import type { ShipModule } from '../types/ModuleTypes.js';
import type { PlayerStats } from '../types/PlayerTypes.js';
export declare function cloneStats(stats: PlayerStats): PlayerStats;
export declare function applyModuleEffect(stats: PlayerStats, effect: ShipModule['effects'][number]): void;
export declare function clampPlayerStats(stats: PlayerStats): void;
export declare function calculateFinalStats(baseStats: PlayerStats, modules: ShipModule[], currentHp: number): PlayerStats;
