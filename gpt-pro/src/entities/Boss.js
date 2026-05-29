import { getEnemyConfig } from '../data/enemyTypes.js';
let bossSerial = 0;
export class Boss {
    id = `boss_${++bossSerial}`;
    config = getEnemyConfig('boss_01');
    active = false;
    dead = false;
    createdAt = 0;
    x = 360;
    y = 180;
    hp = this.config.hp;
    maxHp = this.config.hp;
    radius = 150;
    patternIndex = 0;
    patternElapsedMs = 0;
    spawn(x, y, hp = this.config.hp) {
        this.active = true;
        this.dead = false;
        this.createdAt = performance.now();
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.maxHp = this.config.hp;
        this.patternIndex = 0;
        this.patternElapsedMs = 0;
    }
    takeDamage(amount) {
        if (!this.active || this.dead)
            return false;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            return true;
        }
        return false;
    }
    despawn() {
        this.active = false;
        this.dead = false;
    }
}
//# sourceMappingURL=Boss.js.map