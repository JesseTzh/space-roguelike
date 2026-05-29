export const ENEMY_TYPES = [
    {
        id: 'enemy_small',
        name: '小型敌机',
        hp: 20,
        contactDamage: 10,
        moveSpeed: 180,
        money: 3,
        texture: 'enemy_small_01',
    },
    {
        id: 'enemy_fast',
        name: '快速敌机',
        hp: 15,
        contactDamage: 8,
        moveSpeed: 280,
        money: 4,
        texture: 'enemy_fast_01',
    },
    {
        id: 'enemy_heavy',
        name: '重型敌机',
        hp: 80,
        contactDamage: 20,
        moveSpeed: 100,
        money: 10,
        texture: 'enemy_heavy_01',
        attack: {
            bulletDamage: 10,
            bulletSpeed: 320,
            fireInterval: 2,
            pattern: 'straight',
        },
    },
    {
        id: 'boss_01',
        name: '巡航母舰',
        hp: 2000,
        contactDamage: 25,
        moveSpeed: 60,
        money: 100,
        texture: 'boss_carrier_01',
    },
];
export function getEnemyConfig(id) {
    const config = ENEMY_TYPES.find(enemy => enemy.id === id);
    if (!config)
        throw new Error(`Unknown enemy id: ${id}`);
    return config;
}
//# sourceMappingURL=enemyTypes.js.map