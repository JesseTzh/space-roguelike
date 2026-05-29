export interface InputVector {
    x: number;
    y: number;
}
export declare class PlayerControlSystem {
    private keys;
    private dragging;
    private lastPointerX;
    private lastPointerY;
    private pendingDragX;
    private pendingDragY;
    dragSensitivity: number;
    attach(canvas: HTMLCanvasElement, uiRoot: HTMLElement): void;
    consumeDrag(): InputVector;
    getKeyboardVector(): InputVector;
    private handleKeyDown;
    private handleKeyUp;
}
