import Phaser from 'phaser'

export interface AudioSettings {
  musicEnabled: boolean
  sfxEnabled: boolean
}

/**
 * 简化版 Audio:不加载真实音频,只维护开关状态.
 * 后续可由 PreloadScene 注入真实音频键再播放.
 */
export class AudioSystem {
  private settings: AudioSettings = { musicEnabled: true, sfxEnabled: true }

  constructor(private scene?: Phaser.Scene) {}

  setSettings(settings: AudioSettings): void {
    this.settings = { ...settings }
  }

  setMusicEnabled(v: boolean): void {
    this.settings.musicEnabled = v
  }

  setSfxEnabled(v: boolean): void {
    this.settings.sfxEnabled = v
  }

  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  playSfx(_key: string): void {
    if (!this.settings.sfxEnabled) return
    if (!this.scene) return
    // 不加载真实资源:跳过. 保留接口便于以后接入 Phaser sound.
  }

  playBgm(_key: string): void {
    if (!this.settings.musicEnabled) return
    if (!this.scene) return
  }

  stopBgm(): void {
    if (!this.scene) return
  }
}
