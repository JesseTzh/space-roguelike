import type { PlayerStats } from '../types/PlayerTypes.js';
import type { Vector2Like } from '../types/GameTypes.js';
import { type Targetable } from './TargetingSystem.js';
export interface SpawnBulletCommand {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    owner: 'player';
}
export declare class PlayerAutoAttackSystem {
    private cooldownMs;
    reset(): void;
    update(deltaMs: number, player: Vector2Like, stats: PlayerStats, targets: readonly Targetable[]): SpawnBulletCommand[];
}
