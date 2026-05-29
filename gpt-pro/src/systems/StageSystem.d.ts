import type { StageConfig } from '../types/StageTypes.js';
export declare class StageSystem {
    private readonly stages;
    private index;
    private elapsedSeconds;
    constructor(stages?: readonly StageConfig[]);
    reset(index?: number): void;
    get currentStage(): StageConfig;
    get currentIndex(): number;
    get elapsed(): number;
    get remaining(): number;
    update(deltaSeconds: number): void;
    forceTimer(secondsRemaining: number): void;
    isNormalStageComplete(): boolean;
    nextStage(): boolean;
    jumpToStage(stageId: string): void;
}
