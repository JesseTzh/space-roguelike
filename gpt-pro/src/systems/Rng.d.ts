export interface Rng {
    next(): number;
    nextRange(min: number, max: number): number;
    pick<T>(items: readonly T[]): T;
}
export declare class SeededRng implements Rng {
    private state;
    constructor(seed?: number);
    setSeed(seed: number): void;
    next(): number;
    nextRange(min: number, max: number): number;
    pick<T>(items: readonly T[]): T;
}
