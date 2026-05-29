export declare class Boss {
    readonly id: string;
    readonly config: import("../types/EnemyTypes.js").EnemyConfig;
    active: boolean;
    dead: boolean;
    createdAt: number;
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    radius: number;
    patternIndex: number;
    patternElapsedMs: number;
    spawn(x: number, y: number, hp?: number): void;
    takeDamage(amount: number): boolean;
    despawn(): void;
}
