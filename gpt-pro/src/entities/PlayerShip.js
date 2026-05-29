import { PLAYER_COLLISION_RADIUS } from '../game/constants.js';
import { createPlayerRuntimeState } from '../systems/DamageSystem.js';
import { clamp } from '../systems/MathUtils.js';
export class PlayerShip {
    stats;
    worldWidth;
    worldHeight;
    x;
    y;
    radius = PLAYER_COLLISION_RADIUS;
    runtime;
    constructor(stats, x, y, worldWidth, worldHeight) {
        this.stats = stats;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = x;
        this.y = y;
        this.runtime = createPlayerRuntimeState(stats);
    }
    setStats(stats) {
        this.stats = stats;
        this.runtime.shieldWasPositive = stats.shield > 0;
    }
    moveBy(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.clampToBounds();
    }
    moveDirection(dx, dy, deltaSeconds) {
        const length = Math.hypot(dx, dy);
        if (length <= 0)
            return;
        this.moveBy((dx / length) * this.stats.moveSpeed * deltaSeconds, (dy / length) * this.stats.moveSpeed * deltaSeconds);
    }
    clampToBounds() {
        this.x = clamp(this.x, this.radius, this.worldWidth - this.radius);
        this.y = clamp(this.y, this.radius + 24, this.worldHeight - this.radius - 24);
    }
}
//# sourceMappingURL=PlayerShip.js.map