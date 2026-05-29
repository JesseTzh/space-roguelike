export class ExplosionEffect {
    active = false;
    x = 0;
    y = 0;
    ageMs = 0;
    durationMs = 550;
    radius = 12;
    spawn(x, y, data) {
        const options = data;
        this.active = true;
        this.x = x;
        this.y = y;
        this.ageMs = 0;
        this.radius = options?.radius ?? 32;
    }
    update(deltaMs) {
        if (!this.active)
            return;
        this.ageMs += deltaMs;
        if (this.ageMs >= this.durationMs)
            this.despawn();
    }
    despawn() {
        this.active = false;
    }
}
//# sourceMappingURL=ExplosionEffect.js.map