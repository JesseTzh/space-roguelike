import type { EnemyConfig } from '../types/EnemyTypes.js';
import type { PlayerStats } from '../types/PlayerTypes.js';
import type { StageConfig } from '../types/StageTypes.js';
export declare function calculateKillMoney(enemy: EnemyConfig, playerStats: PlayerStats): number;
export declare function calculateStageReward(stage: StageConfig, playerStats: PlayerStats): number;
export declare function canAfford(money: number, cost: number): boolean;
