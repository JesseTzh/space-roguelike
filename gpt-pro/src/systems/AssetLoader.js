export class AssetLoader {
    images = new Map();
    async loadImages(definitions) {
        await Promise.all(definitions.map(definition => this.loadImage(definition)));
    }
    getImage(key) {
        return this.images.get(key);
    }
    async loadImage(definition) {
        await new Promise(resolve => {
            const image = new Image();
            image.onload = () => {
                this.images.set(definition.key, image);
                resolve();
            };
            image.onerror = () => {
                resolve();
            };
            image.src = definition.url;
        });
    }
}
//# sourceMappingURL=AssetLoader.js.map