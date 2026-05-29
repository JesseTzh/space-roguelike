import { SAVE_KEY } from '../game/constants.js';
export function createDefaultSave() {
    return {
        version: 1,
        clearCount: 0,
        deathCount: 0,
        totalRuns: 0,
        totalKills: 0,
        bestSurvivalTime: 0,
        bestStageReached: 1,
        settings: {
            musicEnabled: true,
            sfxEnabled: true,
            vibrationEnabled: true,
        },
    };
}
export class SaveSystem {
    storage;
    constructor(storage = typeof localStorage !== 'undefined' ? localStorage : undefined) {
        this.storage = storage;
    }
    load() {
        if (!this.storage)
            return createDefaultSave();
        try {
            const raw = this.storage.getItem(SAVE_KEY);
            if (!raw)
                return createDefaultSave();
            const parsed = JSON.parse(raw);
            if (parsed.version !== 1 || !parsed.settings)
                return createDefaultSave();
            return {
                ...createDefaultSave(),
                ...parsed,
                settings: {
                    ...createDefaultSave().settings,
                    ...parsed.settings,
                },
            };
        }
        catch {
            return createDefaultSave();
        }
    }
    save(data) {
        if (!this.storage)
            return;
        try {
            this.storage.setItem(SAVE_KEY, JSON.stringify(data));
        }
        catch {
            // localStorage can be disabled; gameplay should continue.
        }
    }
    recordRun(result, totalKills, survivalTime, stageReached) {
        const data = this.load();
        data.totalRuns += 1;
        data.totalKills += totalKills;
        data.bestSurvivalTime = Math.max(data.bestSurvivalTime, survivalTime);
        data.bestStageReached = Math.max(data.bestStageReached, stageReached);
        if (result === 'clear')
            data.clearCount += 1;
        else
            data.deathCount += 1;
        this.save(data);
        return data;
    }
}
//# sourceMappingURL=SaveSystem.js.map