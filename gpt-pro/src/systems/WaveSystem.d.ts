import type { StageConfig, StageWaveConfig } from '../types/StageTypes.js';
export interface WaveRuntime {
    wave: StageWaveConfig;
    lastSpawnMs: number;
}
export declare class WaveSystem {
    private runtimes;
    startStage(stage: StageConfig): void;
    getSpawnableWaves(stageElapsedSeconds: number, nowMs: number, aliveByEnemyId: (enemyId: string) => number): StageWaveConfig[];
    clear(): void;
}
