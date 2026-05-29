import Phaser from 'phaser'
import { DESIGN_HEIGHT, DESIGN_WIDTH } from './constants'
import { BootScene } from '../scenes/BootScene'
import { PreloadScene } from '../scenes/PreloadScene'
import { MenuScene } from '../scenes/MenuScene'
import { GameScene } from '../scenes/GameScene'
import { PauseScene } from '../scenes/PauseScene'
import { StageResultScene } from '../scenes/StageResultScene'
import { GameResultScene } from '../scenes/GameResultScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#02040a',
  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: false,
    antialias: true
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, PauseScene, StageResultScene, GameResultScene]
}
