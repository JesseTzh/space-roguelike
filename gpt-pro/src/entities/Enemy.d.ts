import type { EnemyConfig } from '../types/EnemyTypes.js';
import type { Poolable } from '../systems/ObjectPool.js';
export interface EnemySpawnData {
    config: EnemyConfig;
    vx: number;
    vy: number;
    hp?: number;
    radius?: number;
}
export declare class Enemy implements Poolable {
    readonly id: string;
    active: boolean;
    dead: boolean;
    config: EnemyConfig;
    configId: string;
    createdAt: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    hp: number;
    radius: number;
    fireCooldownMs: number;
    spawn(x: number, y: number, data?: unknown): void;
    update(deltaMs: number): void;
    takeDamage(amount: number): boolean;
    despawn(): void;
}
