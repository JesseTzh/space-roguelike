import type { GameState } from '../types/GameTypes.js';
export declare class GameStateMachine {
    private stateValue;
    constructor(initialState?: GameState);
    get state(): GameState;
    canTransition(next: GameState): boolean;
    transition(next: GameState): void;
    force(next: GameState): void;
}
