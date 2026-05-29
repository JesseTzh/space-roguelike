export type ModuleCategory = 'weapon' | 'reactor' | 'shield' | 'utility'

export type ModuleRarity = 'common' | 'rare' | 'epic'

export type ModuleEffectType =
  | 'damage_percent'
  | 'fire_rate_percent'
  | 'bullet_count_add'
  | 'bullet_speed_percent'
  | 'bullet_spread_add'
  | 'max_hp_add'
  | 'max_shield_add'
  | 'shield_regen_add'
  | 'move_speed_percent'
  | 'money_bonus_percent'
  | 'on_stage_end_heal'
  | 'on_shield_break_clear_enemy_bullets'
  | 'on_death_revive_once'

export interface ModuleEffect {
  type: ModuleEffectType
  value: number
}

export interface ShipModule {
  id: string
  name: string
  description: string
  category: ModuleCategory
  rarity: ModuleRarity
  effects: ModuleEffect[]
}
