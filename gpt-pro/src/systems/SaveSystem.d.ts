import type { SaveData } from '../types/SaveTypes.js';
export declare function createDefaultSave(): SaveData;
export declare class SaveSystem {
    private readonly storage;
    constructor(storage?: Storage | undefined);
    load(): SaveData;
    save(data: SaveData): void;
    recordRun(result: 'clear' | 'death', totalKills: number, survivalTime: number, stageReached: number): SaveData;
}
