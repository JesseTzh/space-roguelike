export const STAGE_TYPES = [
    {
        id: 'stage_01',
        name: '外围巡航区',
        type: 'normal',
        duration: 60,
        baseReward: 80,
        waves: [
            { enemyId: 'enemy_small', timeStart: 0, timeEnd: 60, spawnInterval: 1200, maxAlive: 12, pattern: 'top' },
        ],
    },
    {
        id: 'stage_02',
        name: '碎星带',
        type: 'normal',
        duration: 75,
        baseReward: 100,
        waves: [
            { enemyId: 'enemy_small', timeStart: 0, timeEnd: 75, spawnInterval: 1000, maxAlive: 16, pattern: 'top' },
            { enemyId: 'enemy_fast', timeStart: 20, timeEnd: 75, spawnInterval: 1600, maxAlive: 8, pattern: 'side' },
        ],
    },
    {
        id: 'stage_03',
        name: '暗礁航道',
        type: 'normal',
        duration: 90,
        baseReward: 120,
        waves: [
            { enemyId: 'enemy_small', timeStart: 0, timeEnd: 90, spawnInterval: 900, maxAlive: 18, pattern: 'random' },
            { enemyId: 'enemy_heavy', timeStart: 25, timeEnd: 90, spawnInterval: 4500, maxAlive: 4, pattern: 'top' },
        ],
    },
    {
        id: 'stage_04',
        name: '核心防线',
        type: 'normal',
        duration: 90,
        baseReward: 150,
        waves: [
            { enemyId: 'enemy_small', timeStart: 0, timeEnd: 90, spawnInterval: 800, maxAlive: 20, pattern: 'top' },
            { enemyId: 'enemy_fast', timeStart: 10, timeEnd: 90, spawnInterval: 1200, maxAlive: 10, pattern: 'diagonal' },
            { enemyId: 'enemy_heavy', timeStart: 25, timeEnd: 90, spawnInterval: 3800, maxAlive: 5, pattern: 'random' },
        ],
    },
    {
        id: 'stage_05',
        name: '母舰拦截战',
        type: 'boss',
        duration: 120,
        baseReward: 0,
        waves: [],
    },
];
export function getStageById(id) {
    const stage = STAGE_TYPES.find(item => item.id === id);
    if (!stage)
        throw new Error(`Unknown stage: ${id}`);
    return stage;
}
//# sourceMappingURL=stageTypes.js.map