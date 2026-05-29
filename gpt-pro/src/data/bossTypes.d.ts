export interface BossPatternConfig {
    id: 'line' | 'fan' | 'aimed';
    interval: number;
    bulletCount: number;
    bulletDamage: number;
    bulletSpeed: number;
}
export declare const BOSS_PATTERNS: BossPatternConfig[];
