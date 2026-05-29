import type { ShipModule } from '../types/ModuleTypes.js';
import type { PlayerStats, PlayerRuntimeState } from '../types/PlayerTypes.js';
export interface DamageResult {
    applied: boolean;
    shieldDamage: number;
    hpDamage: number;
    dead: boolean;
    shieldBroke: boolean;
    revived: boolean;
}
export declare function createPlayerRuntimeState(stats: PlayerStats): PlayerRuntimeState;
export declare function updatePlayerRuntime(state: PlayerRuntimeState, deltaMs: number, stats: PlayerStats): void;
export declare function applyDamageToPlayer(player: PlayerStats, runtime: PlayerRuntimeState, damage: number, modules?: readonly ShipModule[], reviveChargesUsed?: Record<string, number>): DamageResult;
export declare function regenerateShield(player: PlayerStats, deltaSeconds: number): void;
