export interface BackgroundLayerConfig {
    key: string;
    url: string;
    depth: number;
    alpha: number;
    tileScale: number;
    scrollSpeedY: number;
    parallaxX: number;
    parallaxY: number;
}
export declare const BACKGROUND_LAYERS: BackgroundLayerConfig[];
