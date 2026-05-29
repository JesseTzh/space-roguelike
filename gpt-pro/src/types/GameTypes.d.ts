export type GameState = 'Menu' | 'Preload' | 'StageStart' | 'Playing' | 'Paused' | 'StageCleared' | 'StageResult' | 'ModuleSelect' | 'SlotInstall' | 'NextStage' | 'BossStage' | 'Victory' | 'Defeat' | 'GameResult';
export interface Vector2Like {
    x: number;
    y: number;
}
export interface CircleBody extends Vector2Like {
    radius: number;
}
export interface RuntimeMetrics {
    fps: number;
    activeEnemies: number;
    activePlayerBullets: number;
    activeEnemyBullets: number;
    pooledEnemies: number;
    pooledPlayerBullets: number;
    pooledEnemyBullets: number;
    activeExplosions: number;
    currentSceneKey: string;
    currentGameState: GameState;
}
export interface RunState {
    currentStageIndex: number;
    money: number;
    totalKills: number;
    totalMoneyEarned: number;
    survivalTime: number;
    stageKills: number;
    stageKillMoney: number;
    isPaused: boolean;
    isGameOver: boolean;
    isStageCleared: boolean;
    isBossActive: boolean;
    shipSlots: import('./ShipTypes.js').ShipSlot[];
    reviveChargesUsed: Record<string, number>;
}
export interface GameStateSnapshot {
    state: GameState;
    stageId: string;
    stageIndex: number;
    money: number;
    totalKills: number;
    survivalTime: number;
    isBossActive: boolean;
}
export interface PlayerSnapshot extends Vector2Like {
    hp: number;
    maxHp: number;
    shield: number;
    maxShield: number;
    damage: number;
    fireRate: number;
}
export interface EnemySnapshot extends Vector2Like {
    id: string;
    configId: string;
    hp: number;
    active: boolean;
    boss: boolean;
}
export interface BulletSnapshot extends Vector2Like {
    id: string;
    owner: 'player' | 'enemy';
    vx: number;
    vy: number;
    active: boolean;
}
export interface TestRunOptions {
    stageIndex: number;
    money: number;
    seed: number;
}
export interface TestEnemyOptions {
    enemyId: string;
    x: number;
    y: number;
    hp?: number;
}
export interface TestBossOptions {
    hp: number;
    x: number;
    y: number;
}
export interface MvpTestHooks {
    getStateSnapshot(): GameStateSnapshot;
    getPlayerSnapshot(): PlayerSnapshot;
    getEnemySnapshots(): EnemySnapshot[];
    getBulletSnapshots(): BulletSnapshot[];
    getMetrics(): RuntimeMetrics;
    setRngSeed(seed: number): void;
    startNewRun(options?: Partial<TestRunOptions>): void;
    jumpToStage(stageId: string): void;
    fastForward(ms: number): Promise<void>;
    setPlayerHp(hp: number): void;
    setPlayerShield(shield: number): void;
    addMoney(amount: number): void;
    unlockAllSlots(): void;
    spawnEnemy(options: TestEnemyOptions): string;
    spawnBoss(options?: Partial<TestBossOptions>): string;
    clearEnemies(): void;
    clearBullets(): void;
    forceStageTimer(seconds: number): void;
    forceModuleChoices(moduleIds: string[]): void;
    selectModule(moduleId: string): void;
    installModule(slotId: string): void;
}
declare global {
    interface Window {
        __MVP_TEST__?: MvpTestHooks;
    }
}
