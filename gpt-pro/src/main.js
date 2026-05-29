import { GameApp } from './game/GameApp.js';
import './style.js';
const root = document.querySelector('#app');
if (!root)
    throw new Error('Missing #app root');
const app = new GameApp(root);
void app.start();
//# sourceMappingURL=main.js.map