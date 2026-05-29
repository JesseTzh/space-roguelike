import { GameApp } from './game/GameApp.js'
import './style.js'

const root = document.querySelector<HTMLElement>('#app')
if (!root) throw new Error('Missing #app root')

const app = new GameApp(root)
void app.start()
