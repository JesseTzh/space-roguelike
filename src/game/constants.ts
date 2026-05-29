export const GAME_WIDTH = 720
export const GAME_HEIGHT = 1280

export const TOP_SAFE_AREA = 60
export const BOTTOM_SAFE_AREA = 40

export const PLAYER_SHIP_HALF = 36
export const PLAYER_BODY_HALF = 24

export const DRAG_SENSITIVITY = 1

export const PLAYER_MAX_BULLETS = 150
export const ENEMY_MAX_BULLETS = 120
export const MAX_ENEMIES_ON_SCREEN = 30
export const MAX_EXPLOSIONS_ON_SCREEN = 30

export const POOL_INITIAL_PLAYER_BULLETS = 64
export const POOL_INITIAL_ENEMY_BULLETS = 64
export const POOL_INITIAL_ENEMIES = 24
export const POOL_INITIAL_EXPLOSIONS = 16

export const PLAYER_BULLET_LIFETIME_MS = 2000
export const ENEMY_BULLET_LIFETIME_MS = 5000
export const PLAYER_BULLET_RADIUS = 12
export const ENEMY_BULLET_RADIUS = 12

export const HUD_DEPTH = 1500
export const PAUSE_OVERLAY_DEPTH = 2000

export const STAGE_HP_BONUS_MAX = 50

export const MODULE_CHOICE_COUNT = 3

export const STAT_LIMITS = {
  maxHpMin: 1,
  hpMin: 0,
  maxShieldMin: 0,
  shieldMin: 0,
  moveSpeedMin: 180,
  moveSpeedMax: 600,
  fireRateMin: 1,
  fireRateMax: 12,
  bulletCountMin: 1,
  bulletCountMax: 6,
  bulletSpreadMin: 0,
  bulletSpreadMax: 60,
  critRateMin: 0,
  critRateMax: 0.8,
  critDamageMin: 1,
  moneyBonusMin: 0,
  moneyBonusMax: 1,
}
