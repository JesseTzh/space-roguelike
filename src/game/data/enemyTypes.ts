import type { EnemyConfig } from '../../types/EnemyTypes'

export const ENEMY_TYPES: Record<string, EnemyConfig> = {
  enemy_small: {
    id: 'enemy_small',
    name: '小型敌机',
    hp: 20,
    contactDamage: 10,
    moveSpeed: 180,
    money: 3,
    texture: 'enemy_small_01',
  },
  enemy_fast: {
    id: 'enemy_fast',
    name: '快速敌机',
    hp: 15,
    contactDamage: 8,
    moveSpeed: 280,
    money: 4,
    texture: 'enemy_fast_01',
  },
  enemy_heavy: {
    id: 'enemy_heavy',
    name: '重型敌机',
    hp: 80,
    contactDamage: 20,
    moveSpeed: 100,
    money: 10,
    texture: 'enemy_heavy_01',
    attack: {
      bulletDamage: 10,
      bulletSpeed: 320,
      fireInterval: 2000,
      pattern: 'straight',
    },
  },
}

export function getEnemyConfig(id: string): EnemyConfig | undefined {
  return ENEMY_TYPES[id]
}
