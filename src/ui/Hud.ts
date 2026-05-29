import type { PlayerStats } from '../types/PlayerTypes.js'
import type { StageConfig } from '../types/StageTypes.js'
import { formatTime } from '../systems/MathUtils.js'

export interface HudState {
  stats: PlayerStats
  money: number
  stage: StageConfig
  remainingSeconds: number
  bossHp?: number
  bossMaxHp?: number
}

export class Hud {
  draw(ctx: CanvasRenderingContext2D, state: HudState): void {
    ctx.save()
    ctx.font = '24px system-ui, sans-serif'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
    ctx.fillRect(16, 16, 688, state.bossHp !== undefined ? 132 : 92)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${state.stage.name}  ${formatTime(state.remainingSeconds)}`, 28, 24)
    ctx.fillText(`金钱 ${state.money}`, 28, 58)
    this.drawBar(ctx, 210, 24, 260, 20, state.stats.hp / state.stats.maxHp, '#e94b5d', `HP ${Math.ceil(state.stats.hp)}/${Math.ceil(state.stats.maxHp)}`)
    const shieldRatio = state.stats.maxShield > 0 ? state.stats.shield / state.stats.maxShield : 0
    this.drawBar(ctx, 210, 58, 260, 20, shieldRatio, '#49baff', `SH ${Math.ceil(state.stats.shield)}/${Math.ceil(state.stats.maxShield)}`)
    if (state.bossHp !== undefined && state.bossMaxHp !== undefined) {
      this.drawBar(ctx, 28, 106, 664, 24, state.bossHp / state.bossMaxHp, '#ff7a30', `BOSS ${Math.ceil(state.bossHp)}/${state.bossMaxHp}`)
    }
    ctx.restore()
  }

  private drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, ratio: number, color: string, label: string): void {
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.16)'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = color
    ctx.fillRect(x, y, Math.max(0, Math.min(1, ratio)) * w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.strokeRect(x, y, w, h)
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(label, x + 6, y + 2)
    ctx.restore()
  }
}
