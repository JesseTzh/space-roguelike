export interface Poolable {
    active: boolean;
    spawn(x: number, y: number, data?: unknown): void;
    despawn(): void;
}
export declare class ObjectPool<T extends Poolable> {
    private readonly createItem;
    private readonly initialSize;
    private readonly maxSize;
    private readonly items;
    constructor(createItem: () => T, initialSize: number, maxSize?: number);
    get(): T | undefined;
    release(item: T): void;
    releaseAll(): void;
    get activeCount(): number;
    get totalCount(): number;
    get allItems(): readonly T[];
}
