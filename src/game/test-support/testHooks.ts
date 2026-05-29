import type { GameScene } from '../../scenes/GameScene'

interface MvpTestHooks {
  scene: GameScene
  forceSpawnEnemy: (id: string, x?: number, y?: number) => void
  spawnBoss: () => void
  setBossHp: (hp: number) => void
  killAllEnemies: () => void
  damagePlayer: (dmg: number) => void
  addMoney: (amt: number) => void
  installModule: (slotId: string, moduleId: string) => boolean
  unlockNextSlot: () => boolean
  goToNextStage: () => void
  getRunState: () => unknown
  getMoney: () => number
  getPlayerHp: () => number
  getStageIndex: () => number
  getActiveEnemyCount: () => number
}

declare global {
  interface Window {
    __MVP_TEST__?: MvpTestHooks
  }
}

/** 仅在 e2e 模式下挂载 window.__MVP_TEST__,生产 build 不暴露. */
export function installTestHooks(scene: GameScene): void {
  if (typeof window === 'undefined') return
  const env = (import.meta as unknown as { env?: { MODE?: string } }).env
  if (!env || env.MODE !== 'e2e') return
  const hooks: MvpTestHooks = {
    scene,
    forceSpawnEnemy: (id, x, y) => {
      scene.spawner.forceSpawn(id, x, y)
    },
    spawnBoss: () => {
      scene.boss.spawn('boss_01')
    },
    setBossHp: hp => {
      scene.boss.setBossHp(hp)
    },
    killAllEnemies: () => {
      for (const e of scene.spawner.getActiveEnemies()) {
        e.takeDamage(99999)
        e.despawn()
      }
    },
    damagePlayer: dmg => {
      scene.damage.applyDamage(dmg, scene.time.now)
    },
    addMoney: amt => {
      scene.money.addRaw(amt)
      scene.run.money = scene.money.total
    },
    installModule: (slotId, moduleId) => {
      // dynamic require to avoid circular import in non-test bundles
      const mods = (window as unknown as { __MVP_MODULES__?: unknown }).__MVP_MODULES__
      if (mods) {
        const found = (mods as { id: string }[]).find(m => m.id === moduleId)
        if (!found) return false
        return scene.build.installToSlot(slotId, found as never)
      }
      return false
    },
    unlockNextSlot: () => {
      return scene.build.unlockNext() !== null
    },
    goToNextStage: () => {
      scene.advanceToNextStage()
    },
    getRunState: () => scene.run,
    getMoney: () => scene.money.total,
    getPlayerHp: () => scene.ship.stats.hp,
    getStageIndex: () => scene.run.currentStageIndex,
    getActiveEnemyCount: () => scene.spawner.countActive(),
  }
  window.__MVP_TEST__ = hooks
  // 暴露模块列表给 hook 使用
  import('../data/moduleTypes').then(m => {
    ;(window as unknown as { __MVP_MODULES__?: unknown }).__MVP_MODULES__ = m.MODULE_TYPES
  })
}
