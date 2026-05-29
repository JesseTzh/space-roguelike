import type { Poolable } from '../systems/ObjectPool.js';
export declare class ExplosionEffect implements Poolable {
    active: boolean;
    x: number;
    y: number;
    ageMs: number;
    durationMs: number;
    radius: number;
    spawn(x: number, y: number, data?: unknown): void;
    update(deltaMs: number): void;
    despawn(): void;
}
