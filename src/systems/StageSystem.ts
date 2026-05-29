import { STAGE_TYPES } from '../data/stageTypes.js'
import type { StageConfig } from '../types/StageTypes.js'

export class StageSystem {
  private index = 0
  private elapsedSeconds = 0

  constructor(private readonly stages: readonly StageConfig[] = STAGE_TYPES) {}

  reset(index = 0): void {
    this.index = Math.max(0, Math.min(this.stages.length - 1, index))
    this.elapsedSeconds = 0
  }

  get currentStage(): StageConfig {
    return this.stages[this.index]!
  }

  get currentIndex(): number {
    return this.index
  }

  get elapsed(): number {
    return this.elapsedSeconds
  }

  get remaining(): number {
    return Math.max(0, this.currentStage.duration - this.elapsedSeconds)
  }

  update(deltaSeconds: number): void {
    this.elapsedSeconds += deltaSeconds
  }

  forceTimer(secondsRemaining: number): void {
    this.elapsedSeconds = Math.max(0, this.currentStage.duration - secondsRemaining)
  }

  isNormalStageComplete(): boolean {
    return this.currentStage.type === 'normal' && this.elapsedSeconds >= this.currentStage.duration
  }

  nextStage(): boolean {
    if (this.index >= this.stages.length - 1) return false
    this.index += 1
    this.elapsedSeconds = 0
    return true
  }

  jumpToStage(stageId: string): void {
    const nextIndex = this.stages.findIndex(stage => stage.id === stageId)
    if (nextIndex < 0) throw new Error(`Unknown stage ${stageId}`)
    this.index = nextIndex
    this.elapsedSeconds = 0
  }
}
