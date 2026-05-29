import type { ShipModule } from './ModuleTypes'

export interface ShipSlot {
  id: string
  unlocked: boolean
  module?: ShipModule
}

export interface ShipBuildState {
  money: number
  slots: ShipSlot[]
}
