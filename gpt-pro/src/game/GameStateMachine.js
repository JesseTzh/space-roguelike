const ALLOWED_TRANSITIONS = {
    Menu: ['Preload', 'StageStart'],
    Preload: ['Menu'],
    StageStart: ['Playing', 'BossStage'],
    Playing: ['Paused', 'StageCleared', 'Defeat'],
    Paused: ['Playing', 'Menu'],
    StageCleared: ['StageResult', 'Victory', 'Defeat'],
    StageResult: ['ModuleSelect', 'SlotInstall', 'NextStage', 'Menu'],
    ModuleSelect: ['SlotInstall', 'Menu'],
    SlotInstall: ['NextStage', 'Menu'],
    NextStage: ['StageStart'],
    BossStage: ['Paused', 'Victory', 'Defeat'],
    Victory: ['GameResult'],
    Defeat: ['GameResult'],
    GameResult: ['Menu', 'StageStart'],
};
export class GameStateMachine {
    stateValue;
    constructor(initialState = 'Menu') {
        this.stateValue = initialState;
    }
    get state() {
        return this.stateValue;
    }
    canTransition(next) {
        return ALLOWED_TRANSITIONS[this.stateValue].includes(next);
    }
    transition(next) {
        if (!this.canTransition(next)) {
            throw new Error(`Invalid game state transition: ${this.stateValue} -> ${next}`);
        }
        this.stateValue = next;
    }
    force(next) {
        this.stateValue = next;
    }
}
//# sourceMappingURL=GameStateMachine.js.map