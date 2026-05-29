import type { PlayerRuntimeState, PlayerStats } from '../types/PlayerTypes.js';
export declare class PlayerShip {
    stats: PlayerStats;
    private readonly worldWidth;
    private readonly worldHeight;
    x: number;
    y: number;
    radius: number;
    runtime: PlayerRuntimeState;
    constructor(stats: PlayerStats, x: number, y: number, worldWidth: number, worldHeight: number);
    setStats(stats: PlayerStats): void;
    moveBy(dx: number, dy: number): void;
    moveDirection(dx: number, dy: number, deltaSeconds: number): void;
    clampToBounds(): void;
}
