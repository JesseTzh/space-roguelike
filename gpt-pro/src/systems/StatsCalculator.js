import { clamp } from './MathUtils.js';
export function cloneStats(stats) {
    return { ...stats };
}
export function applyModuleEffect(stats, effect) {
    switch (effect.type) {
        case 'damage_percent':
            stats.damage += stats.damage * effect.value;
            break;
        case 'fire_rate_percent':
            stats.fireRate += stats.fireRate * effect.value;
            break;
        case 'bullet_count_add':
            stats.bulletCount += effect.value;
            break;
        case 'bullet_speed_percent':
            stats.bulletSpeed += stats.bulletSpeed * effect.value;
            break;
        case 'bullet_spread_add':
            stats.bulletSpread += effect.value;
            break;
        case 'max_hp_add':
            stats.maxHp += effect.value;
            break;
        case 'max_shield_add':
            stats.maxShield += effect.value;
            break;
        case 'shield_regen_add':
            stats.shieldRegen += effect.value;
            break;
        case 'move_speed_percent':
            stats.moveSpeed += stats.moveSpeed * effect.value;
            break;
        case 'money_bonus_percent':
            stats.moneyBonus += effect.value;
            break;
        case 'on_stage_end_heal':
        case 'on_shield_break_clear_enemy_bullets':
        case 'on_death_revive_once':
            break;
        default: {
            const unknown = effect.type;
            throw new Error(`Unhandled module effect ${unknown}`);
        }
    }
}
export function clampPlayerStats(stats) {
    stats.maxHp = Math.max(1, stats.maxHp);
    stats.hp = clamp(stats.hp, 0, stats.maxHp);
    stats.maxShield = Math.max(0, stats.maxShield);
    stats.shield = clamp(stats.shield, 0, stats.maxShield);
    stats.shieldRegen = Math.max(0, stats.shieldRegen);
    stats.moveSpeed = clamp(stats.moveSpeed, 180, 600);
    stats.fireRate = clamp(stats.fireRate, 1, 12);
    stats.bulletCount = Math.floor(clamp(stats.bulletCount, 1, 6));
    stats.bulletSpread = clamp(stats.bulletSpread, 0, 60);
    stats.critRate = clamp(stats.critRate, 0, 0.8);
    stats.critDamage = Math.max(1, stats.critDamage);
    stats.moneyBonus = clamp(stats.moneyBonus, 0, 1);
}
export function calculateFinalStats(baseStats, modules, currentHp) {
    const finalStats = cloneStats(baseStats);
    let damagePercent = 0;
    let fireRatePercent = 0;
    let bulletSpeedPercent = 0;
    let moveSpeedPercent = 0;
    let moneyBonusPercent = 0;
    for (const module of modules) {
        for (const effect of module.effects) {
            switch (effect.type) {
                case 'damage_percent':
                    damagePercent += effect.value;
                    break;
                case 'fire_rate_percent':
                    fireRatePercent += effect.value;
                    break;
                case 'bullet_speed_percent':
                    bulletSpeedPercent += effect.value;
                    break;
                case 'move_speed_percent':
                    moveSpeedPercent += effect.value;
                    break;
                case 'money_bonus_percent':
                    moneyBonusPercent += effect.value;
                    break;
                case 'bullet_count_add':
                    finalStats.bulletCount += effect.value;
                    break;
                case 'bullet_spread_add':
                    finalStats.bulletSpread += effect.value;
                    break;
                case 'max_hp_add':
                    finalStats.maxHp += effect.value;
                    break;
                case 'max_shield_add':
                    finalStats.maxShield += effect.value;
                    break;
                case 'shield_regen_add':
                    finalStats.shieldRegen += effect.value;
                    break;
                case 'on_stage_end_heal':
                case 'on_shield_break_clear_enemy_bullets':
                case 'on_death_revive_once':
                    break;
                default: {
                    const unknown = effect.type;
                    throw new Error(`Unhandled module effect ${unknown}`);
                }
            }
        }
    }
    finalStats.damage = baseStats.damage * (1 + damagePercent);
    finalStats.fireRate = baseStats.fireRate * (1 + fireRatePercent);
    finalStats.bulletSpeed = baseStats.bulletSpeed * (1 + bulletSpeedPercent);
    finalStats.moveSpeed = baseStats.moveSpeed * (1 + moveSpeedPercent);
    finalStats.moneyBonus = baseStats.moneyBonus + moneyBonusPercent;
    finalStats.hp = currentHp;
    clampPlayerStats(finalStats);
    finalStats.hp = Math.min(currentHp, finalStats.maxHp);
    finalStats.shield = finalStats.maxShield;
    return finalStats;
}
//# sourceMappingURL=StatsCalculator.js.map