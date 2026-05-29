import Phaser from 'phaser'

/**
 * 用 Phaser Graphics 生成占位图形,然后转为 texture key 供其他场景使用.
 * 本项目不加载外部图片,所有素材均由该 Scene 在运行时生成.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  create(): void {
    this.makePlayerShip()
    this.makeEnemySmall()
    this.makeEnemyFast()
    this.makeEnemyHeavy()
    this.makeBoss()
    this.makePlayerBullet()
    this.makeEnemyBullet()
    this.makeStarTile()
    this.makeNebulaTile()
    this.makeDustTile()

    this.scene.start('Menu')
  }

  private makeBox(key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void): void {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0 }, false)
    draw(g)
    g.generateTexture(key, w, h)
    g.destroy()
  }

  private makePlayerShip(): void {
    this.makeBox('player_ship_01', 72, 72, g => {
      g.fillStyle(0x6ee7ff, 1)
      g.fillTriangle(36, 4, 8, 64, 64, 64)
      g.fillStyle(0x2a78a6, 1)
      g.fillRect(28, 40, 16, 22)
      g.fillStyle(0xfff36b, 1)
      g.fillCircle(36, 32, 6)
    })
  }

  private makeEnemySmall(): void {
    this.makeBox('enemy_small_01', 56, 56, g => {
      g.fillStyle(0xff7676, 1)
      g.fillRect(8, 14, 40, 28)
      g.fillStyle(0xa84040, 1)
      g.fillTriangle(28, 4, 12, 16, 44, 16)
      g.fillStyle(0xffe27a, 1)
      g.fillCircle(28, 28, 6)
    })
  }

  private makeEnemyFast(): void {
    this.makeBox('enemy_fast_01', 48, 48, g => {
      g.fillStyle(0xff7eb1, 1)
      g.fillTriangle(24, 4, 4, 44, 44, 44)
      g.fillStyle(0x70203c, 1)
      g.fillRect(20, 20, 8, 16)
    })
  }

  private makeEnemyHeavy(): void {
    this.makeBox('enemy_heavy_01', 96, 96, g => {
      g.fillStyle(0x6e6cff, 1)
      g.fillRect(8, 18, 80, 60)
      g.fillStyle(0x2a2c80, 1)
      g.fillRect(16, 26, 64, 46)
      g.fillStyle(0xffe27a, 1)
      g.fillCircle(48, 48, 10)
    })
  }

  private makeBoss(): void {
    this.makeBox('boss_carrier_01', 320, 220, g => {
      g.fillStyle(0x6e6cff, 1)
      g.fillRect(20, 60, 280, 120)
      g.fillStyle(0x3a378a, 1)
      g.fillRect(60, 30, 200, 60)
      g.fillRect(80, 170, 160, 40)
      g.fillStyle(0xff7eb1, 1)
      g.fillCircle(160, 110, 28)
      g.fillStyle(0xffe27a, 1)
      g.fillRect(40, 100, 14, 14)
      g.fillRect(266, 100, 14, 14)
    })
  }

  private makePlayerBullet(): void {
    this.makeBox('bullet_player_01', 16, 32, g => {
      g.fillStyle(0xfff36b, 1)
      g.fillRect(4, 0, 8, 32)
      g.fillStyle(0xffffff, 1)
      g.fillRect(6, 2, 4, 24)
    })
  }

  private makeEnemyBullet(): void {
    this.makeBox('bullet_enemy_01', 16, 16, g => {
      g.fillStyle(0xff7676, 1)
      g.fillCircle(8, 8, 6)
      g.fillStyle(0xffd0d0, 1)
      g.fillCircle(8, 8, 3)
    })
  }

  private makeStarTile(): void {
    if (this.textures.exists('bg_star_tile_far_01')) return
    const size = 256
    const g = this.make.graphics({ x: 0, y: 0 }, false)
    g.fillStyle(0x040814, 1)
    g.fillRect(0, 0, size, size)
    const rng = mulberry32(1234)
    g.fillStyle(0xffffff, 1)
    for (let i = 0; i < 70; i++) {
      const x = Math.floor(rng() * size)
      const y = Math.floor(rng() * size)
      const r = rng() < 0.85 ? 1 : 2
      g.fillRect(x, y, r, r)
    }
    g.generateTexture('bg_star_tile_far_01', size, size)
    g.destroy()
  }

  private makeNebulaTile(): void {
    if (this.textures.exists('bg_nebula_tile_mid_01')) return
    const size = 256
    const g = this.make.graphics({ x: 0, y: 0 }, false)
    g.fillStyle(0x000000, 0)
    g.fillRect(0, 0, size, size)
    const colors = [0x4a3a8a, 0x6a4ac0, 0x8a4a8a, 0x4a4ab0]
    const rng = mulberry32(5678)
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(rng() * size)
      const y = Math.floor(rng() * size)
      const r = 30 + Math.floor(rng() * 40)
      g.fillStyle(colors[Math.floor(rng() * colors.length)], 0.18)
      g.fillCircle(x, y, r)
    }
    g.generateTexture('bg_nebula_tile_mid_01', size, size)
    g.destroy()
  }

  private makeDustTile(): void {
    if (this.textures.exists('bg_dust_tile_near_01')) return
    const size = 256
    const g = this.make.graphics({ x: 0, y: 0 }, false)
    g.fillStyle(0x000000, 0)
    g.fillRect(0, 0, size, size)
    const rng = mulberry32(9012)
    g.fillStyle(0xffffff, 0.8)
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(rng() * size)
      const y = Math.floor(rng() * size)
      g.fillRect(x, y, 2, 4)
    }
    g.generateTexture('bg_dust_tile_near_01', size, size)
    g.destroy()
  }
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
