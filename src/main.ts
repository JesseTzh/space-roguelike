import Phaser from 'phaser'
import { createPhaserConfig } from './game/config'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { StageResultScene } from './scenes/StageResultScene'
import { GameResultScene } from './scenes/GameResultScene'

function bootstrap(): Phaser.Game {
  const parent = document.getElementById('app') ?? document.body
  const config: Phaser.Types.Core.GameConfig = {
    ...createPhaserConfig(parent),
    scene: [BootScene, PreloadScene, MenuScene, GameScene, StageResultScene, GameResultScene],
  }
  return new Phaser.Game(config)
}

const game = bootstrap()

if (typeof window !== 'undefined') {
  ;(window as unknown as { __MVP_GAME__?: Phaser.Game }).__MVP_GAME__ = game
}
