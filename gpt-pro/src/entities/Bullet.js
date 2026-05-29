let bulletSerial = 0;
export class Bullet {
    id = `bullet_${++bulletSerial}`;
    active = false;
    owner = 'player';
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    damage = 0;
    radius = 12;
    lifetimeMs = 2000;
    ageMs = 0;
    texture = 'bullet_player_01';
    spawn(x, y, data) {
        const bulletData = data;
        this.active = true;
        this.x = x;
        this.y = y;
        this.vx = bulletData.vx;
        this.vy = bulletData.vy;
        this.damage = bulletData.damage;
        this.radius = bulletData.radius ?? 12;
        this.lifetimeMs = bulletData.lifetimeMs ?? (bulletData.owner === 'player' ? 2000 : 5000);
        this.owner = bulletData.owner;
        this.texture = bulletData.texture ?? (bulletData.owner === 'player' ? 'bullet_player_01' : 'bullet_enemy_01');
        this.ageMs = 0;
    }
    update(deltaMs) {
        if (!this.active)
            return;
        const deltaSeconds = deltaMs / 1000;
        this.x += this.vx * deltaSeconds;
        this.y += this.vy * deltaSeconds;
        this.ageMs += deltaMs;
        if (this.ageMs >= this.lifetimeMs)
            this.despawn();
    }
    despawn() {
        this.active = false;
        this.ageMs = 0;
    }
}
//# sourceMappingURL=Bullet.js.map