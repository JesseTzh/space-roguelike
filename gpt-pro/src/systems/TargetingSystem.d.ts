import type { Vector2Like } from '../types/GameTypes.js';
export interface Targetable extends Vector2Like {
    id: string;
    active: boolean;
    dead: boolean;
    y: number;
    createdAt: number;
}
export declare function findNearestTarget(player: Vector2Like, targets: readonly Targetable[]): Targetable | undefined;
