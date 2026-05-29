export interface BackgroundLayerConfig {
  key: string
  url: string
  depth: number
  alpha: number
  tileScale: number
  scrollSpeedY: number
  parallaxX: number
  parallaxY: number
}

export const BACKGROUND_LAYERS: BackgroundLayerConfig[] = [
  {
    key: 'bg_star_tile_far_01',
    url: 'assets/images/backgrounds/bg_star_tile_far_01.png',
    depth: -300,
    alpha: 1,
    tileScale: 1,
    scrollSpeedY: 12,
    parallaxX: 0.02,
    parallaxY: 0.01,
  },
  {
    key: 'bg_nebula_tile_mid_01',
    url: 'assets/images/backgrounds/bg_nebula_tile_mid_01.png',
    depth: -290,
    alpha: 0.55,
    tileScale: 1.15,
    scrollSpeedY: 24,
    parallaxX: 0.04,
    parallaxY: 0.02,
  },
  {
    key: 'bg_dust_tile_near_01',
    url: 'assets/images/backgrounds/bg_dust_tile_near_01.png',
    depth: -280,
    alpha: 0.45,
    tileScale: 1,
    scrollSpeedY: 56,
    parallaxX: 0.08,
    parallaxY: 0.04,
  },
]
