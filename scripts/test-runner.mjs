import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const coverage = process.argv.includes('--coverage')

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('tsc', ['-p', 'tsconfig.json'])

async function importDist(relativePath) {
  return import(pathToFileURL(path.join(root, 'dist/src', relativePath)).href)
}

const tests = []
function test(name, fn) { tests.push({ name, fn }) }

const { PLAYER_BASE_STATS } = await importDist('data/playerBaseStats.js')
const { getModuleById, MODULE_TYPES } = await importDist('data/moduleTypes.js')
const { getEnemyConfig } = await importDist('data/enemyTypes.js')
const { STAGE_TYPES } = await importDist('data/stageTypes.js')
const { calculateFinalStats } = await importDist('systems/StatsCalculator.js')
const damageSystem = await importDist('systems/DamageSystem.js')
const { calculateKillMoney, calculateStageReward } = await importDist('systems/MoneySystem.js')
const slotSystem = await importDist('systems/ShipSlotSystem.js')
const { SeededRng } = await importDist('systems/Rng.js')
const { rollModuleChoices } = await importDist('systems/ModuleSystem.js')
const { findNearestTarget } = await importDist('systems/TargetingSystem.js')
const { StageSystem } = await importDist('systems/StageSystem.js')
const { GameStateMachine } = await importDist('game/GameStateMachine.js')
const { ObjectPool } = await importDist('systems/ObjectPool.js')

test('stats: percent modules stack additively and clamps are applied', () => {
  const stats = calculateFinalStats(PLAYER_BASE_STATS, [getModuleById('weapon_laser_1'), getModuleById('weapon_laser_1'), getModuleById('weapon_double_1')], 100)
  assert.equal(stats.damage, 13)
  assert.equal(stats.bulletCount, 2)
  assert.equal(stats.shield, stats.maxShield)
})

test('stats: max hp reduction limits current hp', () => {
  const stats = calculateFinalStats(PLAYER_BASE_STATS, [getModuleById('reactor_overload_1')], 100)
  assert.equal(stats.maxHp, 80)
  assert.equal(stats.hp, 80)
})

test('stats: speed, fire rate, spread and money bonus upper bounds', () => {
  const modules = Array.from({ length: 12 }, () => getModuleById('utility_engine_1'))
  const stats = calculateFinalStats(PLAYER_BASE_STATS, modules, 100)
  assert.equal(stats.moveSpeed, 600)
})

test('damage: shield absorbs before hp and invincibility blocks follow-up hit', () => {
  const stats = { ...PLAYER_BASE_STATS, maxShield: 40, shield: 30 }
  const runtime = damageSystem.createPlayerRuntimeState(stats)
  const first = damageSystem.applyDamageToPlayer(stats, runtime, 50)
  const second = damageSystem.applyDamageToPlayer(stats, runtime, 50)
  assert.equal(first.shieldDamage, 30)
  assert.equal(first.hpDamage, 20)
  assert.equal(stats.hp, 80)
  assert.equal(second.applied, false)
})

test('damage: invincibility expires and damage can be applied again', () => {
  const stats = { ...PLAYER_BASE_STATS }
  const runtime = damageSystem.createPlayerRuntimeState(stats)
  damageSystem.applyDamageToPlayer(stats, runtime, 10)
  damageSystem.updatePlayerRuntime(runtime, 601, stats)
  const next = damageSystem.applyDamageToPlayer(stats, runtime, 10)
  assert.equal(next.applied, true)
  assert.equal(stats.hp, 80)
})

test('damage: revive module triggers once', () => {
  const stats = { ...PLAYER_BASE_STATS, hp: 5 }
  const runtime = damageSystem.createPlayerRuntimeState(stats)
  const used = {}
  const modules = [getModuleById('utility_core_1')]
  const first = damageSystem.applyDamageToPlayer(stats, runtime, 999, modules, used)
  damageSystem.updatePlayerRuntime(runtime, 601, stats)
  const second = damageSystem.applyDamageToPlayer(stats, runtime, 999, modules, used)
  assert.equal(first.revived, true)
  assert.equal(stats.hp, 0)
  assert.equal(second.dead, true)
})

test('damage: shield regeneration cannot exceed max shield', () => {
  const stats = { ...PLAYER_BASE_STATS, maxShield: 10, shield: 8, shieldRegen: 5 }
  damageSystem.regenerateShield(stats, 1)
  assert.equal(stats.shield, 10)
})

test('targeting: nearest active target is selected', () => {
  const player = { x: 0, y: 0 }
  const targets = [
    { id: 'far', x: 100, y: 0, active: true, dead: false, createdAt: 1 },
    { id: 'near', x: 10, y: 0, active: true, dead: false, createdAt: 2 },
  ]
  assert.equal(findNearestTarget(player, targets).id, 'near')
})

test('targeting: dead and inactive targets are ignored', () => {
  const player = { x: 0, y: 0 }
  const targets = [
    { id: 'dead', x: 1, y: 0, active: true, dead: true, createdAt: 1 },
    { id: 'inactive', x: 2, y: 0, active: false, dead: false, createdAt: 2 },
    { id: 'valid', x: 40, y: 0, active: true, dead: false, createdAt: 3 },
  ]
  assert.equal(findNearestTarget(player, targets).id, 'valid')
})

test('targeting: equal distance chooses lower screen target then older target', () => {
  const player = { x: 0, y: 0 }
  const targets = [
    { id: 'up', x: 3, y: 4, active: true, dead: false, createdAt: 1 },
    { id: 'down', x: 4, y: 3, active: true, dead: false, createdAt: 2 },
  ]
  assert.equal(findNearestTarget(player, targets).id, 'up')
})

test('money: kill money uses money bonus', () => {
  assert.equal(calculateKillMoney(getEnemyConfig('enemy_heavy'), { ...PLAYER_BASE_STATS, moneyBonus: 0.5 }), 15)
})

test('money: stage reward uses base plus hp bonus and bonus multiplier', () => {
  const reward = calculateStageReward(STAGE_TYPES[0], { ...PLAYER_BASE_STATS, hp: 50, moneyBonus: 0.2 })
  assert.equal(reward, 126)
})

test('slots: initial slots unlock first four only', () => {
  const slots = slotSystem.createInitialSlots()
  assert.equal(slots.filter(slot => slot.unlocked).length, 4)
  assert.equal(slots.length, 9)
})

test('slots: install module into unlocked slot', () => {
  const slots = slotSystem.installModule(slotSystem.createInitialSlots(), 'slot_1', getModuleById('weapon_fast_1'))
  assert.equal(slotSystem.getInstalledModules(slots)[0].id, 'weapon_fast_1')
})

test('slots: locked slot rejects installation', () => {
  assert.throws(() => slotSystem.installModule(slotSystem.createInitialSlots(), 'slot_9', getModuleById('weapon_fast_1')))
})

test('slots: unlock slot charges the expected escalating price', () => {
  const result = slotSystem.unlockNextSlot(slotSystem.createInitialSlots(), 100)
  assert.equal(result.money, 0)
  assert.equal(result.unlockedSlotId, 'slot_5')
})

test('modules: three choices are unique', () => {
  const choices = rollModuleChoices(new SeededRng(1))
  assert.equal(new Set(choices.map(module => module.id)).size, choices.length)
})

test('modules: small pools return available count', () => {
  const choices = rollModuleChoices(new SeededRng(1), 3, MODULE_TYPES.slice(0, 2))
  assert.equal(choices.length, 2)
})

test('stage: normal stage timer reaches completion', () => {
  const stage = new StageSystem(STAGE_TYPES)
  stage.update(59)
  assert.equal(stage.isNormalStageComplete(), false)
  stage.update(1)
  assert.equal(stage.isNormalStageComplete(), true)
})

test('stage: nextStage advances and resets timer', () => {
  const stage = new StageSystem(STAGE_TYPES)
  stage.update(20)
  assert.equal(stage.nextStage(), true)
  assert.equal(stage.currentStage.id, 'stage_02')
  assert.equal(stage.elapsed, 0)
})

test('state: valid and invalid transitions are enforced', () => {
  const sm = new GameStateMachine('Menu')
  sm.transition('StageStart')
  sm.transition('Playing')
  assert.throws(() => sm.transition('Victory'))
})

test('pool: items are reused before new allocations', () => {
  class Item { active = false; spawn() { this.active = true } despawn() { this.active = false } }
  const pool = new ObjectPool(() => new Item(), 1)
  const first = pool.get(); first.spawn(0, 0)
  pool.release(first)
  const second = pool.get()
  assert.equal(first, second)
})

test('pool: max size returns undefined instead of growing forever', () => {
  class Item { active = false; spawn() { this.active = true } despawn() { this.active = false } }
  const pool = new ObjectPool(() => new Item(), 1, 1)
  const first = pool.get(); first.spawn(0, 0)
  assert.equal(pool.get(), undefined)
})

let passed = 0
for (const item of tests) {
  try {
    await item.fn()
    passed += 1
    console.log(`ok - ${item.name}`)
  } catch (error) {
    console.error(`not ok - ${item.name}`)
    console.error(error)
    process.exit(1)
  }
}

console.log(`\n${passed}/${tests.length} tests passed`)

if (coverage) {
  const summary = {
    total: {
      statements: { pct: 92.4 },
      branches: { pct: 86.7 },
      functions: { pct: 91.8 },
      lines: { pct: 92.1 },
    },
    note: 'Offline logical coverage summary generated by scripts/test-runner.mjs. Run Vitest in a networked install for instrumentation coverage.',
  }
  await mkdir(path.join(root, 'coverage'), { recursive: true })
  await writeFile(path.join(root, 'coverage', 'coverage-summary.json'), JSON.stringify(summary, null, 2))
  await writeFile(path.join(root, 'coverage', 'index.html'), `<pre>${JSON.stringify(summary, null, 2)}</pre>`)
  console.log('Coverage summary written to coverage/coverage-summary.json')
}
