import type { PlayerStats } from '../types/PlayerTypes.js';
import type { StageConfig } from '../types/StageTypes.js';
export interface HudState {
    stats: PlayerStats;
    money: number;
    stage: StageConfig;
    remainingSeconds: number;
    bossHp?: number;
    bossMaxHp?: number;
}
export declare class Hud {
    draw(ctx: CanvasRenderingContext2D, state: HudState): void;
    private drawBar;
}
