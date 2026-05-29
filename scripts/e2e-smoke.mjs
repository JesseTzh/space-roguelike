import assert from 'node:assert/strict'
import { existsSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
if (!existsSync(path.join(dist, 'index.html'))) {
  const result = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const index = await readFile(path.join(dist, 'index.html'), 'utf8')
assert.match(index, /\.\/src\/main\.js/)
assert.ok(existsSync(path.join(dist, 'src/main.js')), 'main bundle should exist')
assert.ok(existsSync(path.join(dist, 'assets/images/backgrounds/bg_star_tile_far_01.png')), 'background asset should exist')
assert.ok(existsSync(path.join(dist, 'assets/images/player/player_ship_01.png')), 'player asset should exist')

const modules = await readdir(path.join(dist, 'assets/images/modules'))
assert.ok(modules.filter(name => name.endsWith('.png')).length >= 17, 'module icons should exist')
assert.ok(statSync(path.join(dist, 'src/game/GameApp.js')).size > 1000, 'GameApp build should be non-empty')

console.log('E2E smoke checks passed: build output, main script, assets and module icons are present.')
