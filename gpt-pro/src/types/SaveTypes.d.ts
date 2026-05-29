export interface SaveData {
    version: number;
    clearCount: number;
    deathCount: number;
    totalRuns: number;
    totalKills: number;
    bestSurvivalTime: number;
    bestStageReached: number;
    settings: {
        musicEnabled: boolean;
        sfxEnabled: boolean;
        vibrationEnabled: boolean;
    };
}
