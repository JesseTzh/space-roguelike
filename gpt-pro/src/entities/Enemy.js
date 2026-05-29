let enemySerial = 0;
export class Enemy {
    id = `enemy_${++enemySerial}`;
    active = false;
    dead = false;
    config;
    configId = '';
    createdAt = 0;
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    hp = 1;
    radius = 28;
    fireCooldownMs = 0;
    spawn(x, y, data) {
        const spawnData = data;
        this.config = spawnData.config;
        this.configId = spawnData.config.id;
        this.active = true;
        this.dead = false;
        this.createdAt = performance.now();
        this.x = x;
        this.y = y;
        this.vx = spawnData.vx;
        this.vy = spawnData.vy;
        this.hp = spawnData.hp ?? spawnData.config.hp;
        this.radius = spawnData.radius ?? (spawnData.config.id === 'enemy_heavy' ? 42 : 28);
        this.fireCooldownMs = (spawnData.config.attack?.fireInterval ?? 2) * 1000;
    }
    update(deltaMs) {
        if (!this.active)
            return;
        const deltaSeconds = deltaMs / 1000;
        this.x += this.vx * deltaSeconds;
        this.y += this.vy * deltaSeconds;
        this.fireCooldownMs -= deltaMs;
    }
    takeDamage(amount) {
        if (!this.active || this.dead)
            return false;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.dead = true;
            return true;
        }
        return false;
    }
    despawn() {
        this.active = false;
        this.dead = false;
        this.hp = 0;
    }
}
//# sourceMappingURL=Enemy.js.map