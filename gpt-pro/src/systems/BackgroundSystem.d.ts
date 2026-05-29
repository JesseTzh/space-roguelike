export declare class BackgroundSystem {
    private readonly assetProvider;
    private readonly layers;
    private lastPlayerX;
    private lastPlayerY;
    private paused;
    constructor(assetProvider: (key: string) => HTMLImageElement | undefined);
    create(initialPlayerX: number, initialPlayerY: number): void;
    update(deltaMs: number, playerX: number, playerY: number): void;
    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;
    resize(_width: number, _height: number): void;
    setPaused(paused: boolean): void;
    destroy(): void;
}
