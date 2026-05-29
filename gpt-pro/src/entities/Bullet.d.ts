import type { Poolable } from '../systems/ObjectPool.js';
export interface BulletSpawnData {
    owner: 'player' | 'enemy';
    vx: number;
    vy: number;
    damage: number;
    radius?: number;
    lifetimeMs?: number;
    texture?: string;
}
export declare class Bullet implements Poolable {
    readonly id: string;
    active: boolean;
    owner: 'player' | 'enemy';
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    radius: number;
    lifetimeMs: number;
    ageMs: number;
    texture: string;
    spawn(x: number, y: number, data?: unknown): void;
    update(deltaMs: number): void;
    despawn(): void;
}
