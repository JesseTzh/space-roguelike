export function calculateKillMoney(enemy, playerStats) {
    return Math.max(0, Math.floor(enemy.money * (1 + playerStats.moneyBonus)));
}
export function calculateStageReward(stage, playerStats) {
    const hpPercent = playerStats.maxHp > 0 ? playerStats.hp / playerStats.maxHp : 0;
    const hpBonus = Math.floor(Math.max(0, hpPercent) * 50);
    const stageReward = stage.baseReward + hpBonus;
    return Math.max(0, Math.floor(stageReward * (1 + playerStats.moneyBonus)));
}
export function canAfford(money, cost) {
    return money >= cost;
}
//# sourceMappingURL=MoneySystem.js.map