import Phaser from 'phaser'
import { gameConfig } from './config'
import { applyMobilePageGuards } from '../systems/MobileAdaptSystem'

export class GameApp {
  private game?: Phaser.Game

  start(): Phaser.Game {
    applyMobilePageGuards()
    this.game = new Phaser.Game(gameConfig)
    return this.game
  }

  destroy(): void {
    this.game?.destroy(true)
    this.game = undefined
  }
}
