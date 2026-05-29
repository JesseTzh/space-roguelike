import Phaser from 'phaser'
import { Enemy } from '../entities/Enemy'
import { ObjectPool } from './ObjectPool'
import type { StageConfig, StageWaveConfig } from '../types/StageTypes'
import { getEnemyConfig } from '../game/data/enemyTypes'
import { GAME_HEIGHT, GAME_WIDTH, MAX_ENEMIES_ON_SCREEN, POOL_INITIAL_ENEMIES } from '../game/constants'

interface WaveRuntime {
  config: StageWaveConfig
  lastSpawnAt: number
  spawnedCount: number
}

export class EnemySpawner {
  readonly pool: ObjectPool<Enemy>
  private waves: WaveRuntime[] = []
  private elapsedSeconds = 0
  enabled = true

  constructor(private scene: Phaser.Scene) {
    this.pool = new ObjectPool<Enemy>(() => new Enemy(scene), POOL_INITIAL_ENEMIES)
  }

  startStage(stage: StageConfig): void {
    this.elapsedSeconds = 0
    this.waves = stage.waves.map(w => ({ config: w, lastSpawnAt: -Infinity, spawnedCount: 0 }))
  }

  stop(): void {
    this.waves = []
    this.enabled = false
  }

  resume(): void {
    this.enabled = true
  }

  update(deltaMs: number): void {
    if (!this.enabled) return
    this.elapsedSeconds += deltaMs / 1000
    if (this.countActive() >= MAX_ENEMIES_ON_SCREEN) return

    const t = this.elapsedSeconds * 1000
    for (const w of this.waves) {
      if (this.elapsedSeconds < w.config.timeStart) continue
      if (this.elapsedSeconds >= w.config.timeEnd) continue
      const aliveOfWave = this.countAliveByConfig(w.config.enemyId)
      if (aliveOfWave >= w.config.maxAlive) continue
      if (t - w.lastSpawnAt < w.config.spawnInterval) continue
      const cfg = getEnemyConfig(w.config.enemyId)
      if (!cfg) continue
      const { x, y } = this.pickSpawnPosition(w.config.pattern)
      const enemy = this.pool.get()
      enemy.spawn(x, y, { config: cfg, pattern: w.config.pattern })
      w.lastSpawnAt = t
      w.spawnedCount++
    }
    // 回收离开屏幕的敌人
    this.pool.forEachActive(e => {
      if (e.y > GAME_HEIGHT + 80 || e.x < -80 || e.x > GAME_WIDTH + 80) {
        e.despawn()
      }
    })
  }

  /** 测试用: 强制生成一个敌人 */
  forceSpawn(enemyId: string, x?: number, y?: number, pattern: 'top' | 'side' | 'diagonal' | 'random' = 'top'): Enemy | null {
    const cfg = getEnemyConfig(enemyId)
    if (!cfg) return null
    const px = x ?? GAME_WIDTH / 2
    const py = y ?? 100
    const e = this.pool.get()
    e.spawn(px, py, { config: cfg, pattern, vyOverride: 0, vxOverride: 0 })
    return e
  }

  private pickSpawnPosition(pattern: StageWaveConfig['pattern']): { x: number; y: number } {
    switch (pattern) {
      case 'top': {
        return { x: 60 + Math.random() * (GAME_WIDTH - 120), y: -40 }
      }
      case 'side': {
        const fromLeft = Math.random() < 0.5
        return { x: fromLeft ? -40 : GAME_WIDTH + 40, y: 80 + Math.random() * 200 }
      }
      case 'diagonal': {
        const fromLeft = Math.random() < 0.5
        return { x: fromLeft ? -40 : GAME_WIDTH + 40, y: -40 }
      }
      case 'random':
      default:
        return { x: 60 + Math.random() * (GAME_WIDTH - 120), y: -40 }
    }
  }

  countActive(): number {
    return this.pool.countActive()
  }

  countAliveByConfig(configId: string): number {
    let n = 0
    this.pool.forEachActive(e => {
      if (e.configId === configId && e.hp > 0) n++
    })
    return n
  }

  getActiveEnemies(): Enemy[] {
    const arr: Enemy[] = []
    this.pool.forEachActive(e => arr.push(e))
    return arr
  }

  step(deltaMs: number): void {
    this.pool.forEachActive(e => e.step(deltaMs))
  }

  clearAll(): void {
    this.pool.releaseAll()
  }
}
