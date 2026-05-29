import type { StageConfig, StageWaveConfig } from '../types/StageTypes.js'

export interface WaveRuntime {
  wave: StageWaveConfig
  lastSpawnMs: number
}

export class WaveSystem {
  private runtimes: WaveRuntime[] = []

  startStage(stage: StageConfig): void {
    this.runtimes = stage.waves.map(wave => ({ wave, lastSpawnMs: -wave.spawnInterval }))
  }

  getSpawnableWaves(stageElapsedSeconds: number, nowMs: number, aliveByEnemyId: (enemyId: string) => number): StageWaveConfig[] {
    const result: StageWaveConfig[] = []
    for (const runtime of this.runtimes) {
      const { wave } = runtime
      if (stageElapsedSeconds < wave.timeStart || stageElapsedSeconds > wave.timeEnd) continue
      if (aliveByEnemyId(wave.enemyId) >= wave.maxAlive) continue
      if (nowMs - runtime.lastSpawnMs >= wave.spawnInterval) {
        runtime.lastSpawnMs = nowMs
        result.push(wave)
      }
    }
    return result
  }

  clear(): void {
    this.runtimes = []
  }
}
