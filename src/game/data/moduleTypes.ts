import type { ShipModule } from '../../types/ModuleTypes'

export const MODULE_TYPES: ShipModule[] = [
  // 武器
  {
    id: 'weapon_laser_1',
    name: '轻型激光炮',
    description: '伤害 +15%',
    category: 'weapon',
    rarity: 'common',
    effects: [{ type: 'damage_percent', value: 0.15 }],
  },
  {
    id: 'weapon_fast_1',
    name: '速射炮管',
    description: '射速 +15%',
    category: 'weapon',
    rarity: 'common',
    effects: [{ type: 'fire_rate_percent', value: 0.15 }],
  },
  {
    id: 'weapon_double_1',
    name: '双联炮',
    description: '子弹数量 +1',
    category: 'weapon',
    rarity: 'rare',
    effects: [{ type: 'bullet_count_add', value: 1 }],
  },
  {
    id: 'weapon_spread_1',
    name: '散射炮口',
    description: '子弹散射角 +20°',
    category: 'weapon',
    rarity: 'rare',
    effects: [{ type: 'bullet_spread_add', value: 20 }],
  },
  {
    id: 'weapon_railgun_1',
    name: '轨道炮',
    description: '伤害 +40%, 射速 -10%',
    category: 'weapon',
    rarity: 'epic',
    effects: [
      { type: 'damage_percent', value: 0.4 },
      { type: 'fire_rate_percent', value: -0.1 },
    ],
  },
  // 反应炉
  {
    id: 'reactor_small_1',
    name: '小型反应炉',
    description: '射速 +10%',
    category: 'reactor',
    rarity: 'common',
    effects: [{ type: 'fire_rate_percent', value: 0.1 }],
  },
  {
    id: 'reactor_power_1',
    name: '高能反应炉',
    description: '伤害 +20%, 子弹速度 +10%',
    category: 'reactor',
    rarity: 'rare',
    effects: [
      { type: 'damage_percent', value: 0.2 },
      { type: 'bullet_speed_percent', value: 0.1 },
    ],
  },
  {
    id: 'reactor_engine_1',
    name: '推进反应炉',
    description: '移动速度 +10%',
    category: 'reactor',
    rarity: 'common',
    effects: [{ type: 'move_speed_percent', value: 0.1 }],
  },
  {
    id: 'reactor_overload_1',
    name: '过载反应炉',
    description: '伤害 +35%, 最大生命 -20',
    category: 'reactor',
    rarity: 'epic',
    effects: [
      { type: 'damage_percent', value: 0.35 },
      { type: 'max_hp_add', value: -20 },
    ],
  },
  // 护盾
  {
    id: 'shield_basic_1',
    name: '护盾发生器',
    description: '最大护盾 +40',
    category: 'shield',
    rarity: 'common',
    effects: [{ type: 'max_shield_add', value: 40 }],
  },
  {
    id: 'shield_regen_1',
    name: '再生护盾',
    description: '护盾每秒恢复 +2',
    category: 'shield',
    rarity: 'rare',
    effects: [{ type: 'shield_regen_add', value: 2 }],
  },
  {
    id: 'shield_heavy_1',
    name: '重型护盾',
    description: '最大护盾 +80, 移动速度 -8%',
    category: 'shield',
    rarity: 'rare',
    effects: [
      { type: 'max_shield_add', value: 80 },
      { type: 'move_speed_percent', value: -0.08 },
    ],
  },
  {
    id: 'shield_burst_1',
    name: '爆裂护盾',
    description: '护盾破裂时清除周围敌方子弹',
    category: 'shield',
    rarity: 'epic',
    effects: [{ type: 'on_shield_break_clear_enemy_bullets', value: 1 }],
  },
  // 通用
  {
    id: 'utility_engine_1',
    name: '推进器强化',
    description: '移动速度 +12%',
    category: 'utility',
    rarity: 'common',
    effects: [{ type: 'move_speed_percent', value: 0.12 }],
  },
  {
    id: 'utility_radar_1',
    name: '战利品雷达',
    description: '金钱获取 +15%',
    category: 'utility',
    rarity: 'common',
    effects: [{ type: 'money_bonus_percent', value: 0.15 }],
  },
  {
    id: 'utility_repair_1',
    name: '自动维修装置',
    description: '每关结束恢复 20 生命',
    category: 'utility',
    rarity: 'rare',
    effects: [{ type: 'on_stage_end_heal', value: 20 }],
  },
  {
    id: 'utility_core_1',
    name: '备用核心',
    description: '死亡时复活一次, 恢复 30% 最大生命',
    category: 'utility',
    rarity: 'epic',
    effects: [{ type: 'on_death_revive_once', value: 0.3 }],
  },
]

export const RARITY_WEIGHTS: Record<string, number> = {
  common: 100,
  rare: 35,
  epic: 10,
}

export function getModuleById(id: string): ShipModule | undefined {
  return MODULE_TYPES.find(m => m.id === id)
}
