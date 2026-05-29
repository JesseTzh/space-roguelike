import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const publicDir = path.join(root, 'public')

await mkdir(dist, { recursive: true })
if (existsSync(path.join(dist, 'assets'))) await rm(path.join(dist, 'assets'), { recursive: true, force: true })
if (existsSync(publicDir)) await cp(publicDir, dist, { recursive: true })

const index = await readFile(path.join(root, 'index.html'), 'utf8')
const builtIndex = index.replace('/src/main.ts', './src/main.js')
await writeFile(path.join(dist, 'index.html'), builtIndex)

console.log('Build completed: dist/index.html')
