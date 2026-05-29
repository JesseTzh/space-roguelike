export class WaveSystem {
    runtimes = [];
    startStage(stage) {
        this.runtimes = stage.waves.map(wave => ({ wave, lastSpawnMs: -wave.spawnInterval }));
    }
    getSpawnableWaves(stageElapsedSeconds, nowMs, aliveByEnemyId) {
        const result = [];
        for (const runtime of this.runtimes) {
            const { wave } = runtime;
            if (stageElapsedSeconds < wave.timeStart || stageElapsedSeconds > wave.timeEnd)
                continue;
            if (aliveByEnemyId(wave.enemyId) >= wave.maxAlive)
                continue;
            if (nowMs - runtime.lastSpawnMs >= wave.spawnInterval) {
                runtime.lastSpawnMs = nowMs;
                result.push(wave);
            }
        }
        return result;
    }
    clear() {
        this.runtimes = [];
    }
}
//# sourceMappingURL=WaveSystem.js.map