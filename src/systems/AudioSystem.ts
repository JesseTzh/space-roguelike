export class AudioSystem {
  private musicEnabled = true
  private sfxEnabled = true

  setMusicEnabled(enabled: boolean): void { this.musicEnabled = enabled }
  setSfxEnabled(enabled: boolean): void { this.sfxEnabled = enabled }
  isMusicEnabled(): boolean { return this.musicEnabled }
  isSfxEnabled(): boolean { return this.sfxEnabled }
  playBgm(): void { /* Audio unlocking is handled by Phaser/browser after user interaction. */ }
  stopBgm(): void { /* no-op placeholder for MVP */ }
  playSfx(_key: string): void { if (!this.sfxEnabled) return }
}
