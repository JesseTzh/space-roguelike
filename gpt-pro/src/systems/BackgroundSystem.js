import { BACKGROUND_LAYERS } from '../data/backgroundLayers.js';
export class BackgroundSystem {
    assetProvider;
    layers = [];
    lastPlayerX = 0;
    lastPlayerY = 0;
    paused = false;
    constructor(assetProvider) {
        this.assetProvider = assetProvider;
    }
    create(initialPlayerX, initialPlayerY) {
        this.layers.length = 0;
        for (const config of BACKGROUND_LAYERS) {
            this.layers.push({ config, image: this.assetProvider(config.key), tileX: 0, tileY: 0 });
        }
        this.lastPlayerX = initialPlayerX;
        this.lastPlayerY = initialPlayerY;
    }
    update(deltaMs, playerX, playerY) {
        if (this.paused)
            return;
        const deltaSeconds = deltaMs / 1000;
        const playerDeltaX = playerX - this.lastPlayerX;
        const playerDeltaY = playerY - this.lastPlayerY;
        for (const layer of this.layers) {
            layer.tileY -= layer.config.scrollSpeedY * deltaSeconds;
            layer.tileX += playerDeltaX * layer.config.parallaxX;
            layer.tileY += playerDeltaY * layer.config.parallaxY;
        }
        this.lastPlayerX = playerX;
        this.lastPlayerY = playerY;
    }
    draw(ctx, width, height) {
        ctx.save();
        ctx.fillStyle = '#020817';
        ctx.fillRect(0, 0, width, height);
        for (const layer of this.layers) {
            const image = layer.image;
            if (!image || !image.complete || image.naturalWidth === 0)
                continue;
            const tileWidth = image.naturalWidth * layer.config.tileScale;
            const tileHeight = image.naturalHeight * layer.config.tileScale;
            const startX = -(((layer.tileX % tileWidth) + tileWidth) % tileWidth);
            const startY = -(((layer.tileY % tileHeight) + tileHeight) % tileHeight);
            ctx.save();
            ctx.globalAlpha = layer.config.alpha;
            for (let x = startX - tileWidth; x < width + tileWidth; x += tileWidth) {
                for (let y = startY - tileHeight; y < height + tileHeight; y += tileHeight) {
                    ctx.drawImage(image, x, y, tileWidth, tileHeight);
                }
            }
            ctx.restore();
        }
        ctx.restore();
    }
    resize(_width, _height) {
        // Canvas implementation draws to the current viewport every frame.
    }
    setPaused(paused) {
        this.paused = paused;
    }
    destroy() {
        this.layers.length = 0;
    }
}
//# sourceMappingURL=BackgroundSystem.js.map