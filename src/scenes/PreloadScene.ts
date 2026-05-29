import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene') }

  preload(): void {
    const { width, height } = this.scale
    const label = this.add.text(width / 2, height / 2 - 24, '加载中 0%', { color: '#bfefff', fontSize: '28px' }).setOrigin(0.5)
    const barBg = this.add.rectangle(width / 2, height / 2 + 24, 420, 18, 0x1a2b45).setOrigin(0.5)
    const bar = this.add.rectangle(width / 2 - 210, height / 2 + 24, 0, 18, 0x7ee8ff).setOrigin(0, 0.5)

    this.load.on('progress', (value: number) => {
      label.setText(`加载中 ${Math.floor(value * 100)}%`)
      bar.width = 420 * value
    })
    this.load.on('complete', () => {
      label.destroy()
      bar.destroy()
      barBg.destroy()
    })

    this.load.image('player_ship_01', 'assets/images/player/player_ship_01.png')
    this.load.image('enemy_small_01', 'assets/images/enemies/enemy_small_01.png')
    this.load.image('enemy_fast_01', 'assets/images/enemies/enemy_fast_01.png')
    this.load.image('enemy_heavy_01', 'assets/images/enemies/enemy_heavy_01.png')
    this.load.image('boss_carrier_01', 'assets/images/enemies/boss_carrier_01.png')
    this.load.image('bullet_player_01', 'assets/images/bullets/bullet_player_01.png')
    this.load.image('bullet_enemy_01', 'assets/images/bullets/bullet_enemy_01.png')
    this.load.image('bg_star_tile_far_01', 'assets/images/backgrounds/bg_star_tile_far_01.png')
    this.load.image('bg_nebula_tile_mid_01', 'assets/images/backgrounds/bg_nebula_tile_mid_01.png')
    this.load.image('bg_dust_tile_near_01', 'assets/images/backgrounds/bg_dust_tile_near_01.png')
    this.load.spritesheet('effect_explosion_01', 'assets/images/effects/effect_explosion_01.png', { frameWidth: 128, frameHeight: 128 })
    this.load.image('ui_button_01', 'assets/images/ui/ui_button_01.png')
    this.load.image('ui_module_card_01', 'assets/images/ui/ui_module_card_01.png')
    this.load.image('ui_slot_01', 'assets/images/ui/ui_slot_01.png')
    this.load.image('icon_money_01', 'assets/images/ui/icon_money_01.png')
    this.load.image('icon_hp_01', 'assets/images/ui/icon_hp_01.png')
    this.load.image('icon_shield_01', 'assets/images/ui/icon_shield_01.png')

    const moduleIcons = [
      'module_weapon_laser_1', 'module_weapon_fast_1', 'module_weapon_double_1', 'module_weapon_spread_1', 'module_weapon_railgun_1',
      'module_reactor_small_1', 'module_reactor_power_1', 'module_reactor_engine_1', 'module_reactor_overload_1',
      'module_shield_basic_1', 'module_shield_regen_1', 'module_shield_heavy_1', 'module_shield_burst_1',
      'module_utility_engine_1', 'module_utility_radar_1', 'module_utility_repair_1', 'module_utility_core_1'
    ]
    for (const key of moduleIcons) {
      this.load.image(key, `assets/images/modules/${key}.png`)
    }
  }

  create(): void {
    this.anims.create({ key: 'explosion', frames: this.anims.generateFrameNumbers('effect_explosion_01', { start: 0, end: 15 }), frameRate: 22, repeat: 0 })
    this.scene.start('MenuScene')
  }
}
