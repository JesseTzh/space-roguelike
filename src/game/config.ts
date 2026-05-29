import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

export function createPhaserConfig(parent: HTMLElement | string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#040814',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    input: {
      activePointers: 3,
      touch: { capture: true },
    },
    render: {
      pixelArt: false,
      antialias: true,
      roundPixels: false,
    },
    audio: {
      noAudio: false,
    },
    autoFocus: true,
  }
}
