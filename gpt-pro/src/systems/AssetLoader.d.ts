export interface ImageAssetDefinition {
    key: string;
    url: string;
}
export declare class AssetLoader {
    private readonly images;
    loadImages(definitions: ImageAssetDefinition[]): Promise<void>;
    getImage(key: string): HTMLImageElement | undefined;
    private loadImage;
}
