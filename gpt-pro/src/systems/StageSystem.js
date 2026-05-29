import { STAGE_TYPES } from '../data/stageTypes.js';
export class StageSystem {
    stages;
    index = 0;
    elapsedSeconds = 0;
    constructor(stages = STAGE_TYPES) {
        this.stages = stages;
    }
    reset(index = 0) {
        this.index = Math.max(0, Math.min(this.stages.length - 1, index));
        this.elapsedSeconds = 0;
    }
    get currentStage() {
        return this.stages[this.index];
    }
    get currentIndex() {
        return this.index;
    }
    get elapsed() {
        return this.elapsedSeconds;
    }
    get remaining() {
        return Math.max(0, this.currentStage.duration - this.elapsedSeconds);
    }
    update(deltaSeconds) {
        this.elapsedSeconds += deltaSeconds;
    }
    forceTimer(secondsRemaining) {
        this.elapsedSeconds = Math.max(0, this.currentStage.duration - secondsRemaining);
    }
    isNormalStageComplete() {
        return this.currentStage.type === 'normal' && this.elapsedSeconds >= this.currentStage.duration;
    }
    nextStage() {
        if (this.index >= this.stages.length - 1)
            return false;
        this.index += 1;
        this.elapsedSeconds = 0;
        return true;
    }
    jumpToStage(stageId) {
        const nextIndex = this.stages.findIndex(stage => stage.id === stageId);
        if (nextIndex < 0)
            throw new Error(`Unknown stage ${stageId}`);
        this.index = nextIndex;
        this.elapsedSeconds = 0;
    }
}
//# sourceMappingURL=StageSystem.js.map