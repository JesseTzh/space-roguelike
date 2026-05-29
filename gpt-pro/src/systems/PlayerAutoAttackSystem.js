import { angleBetween, degToRad } from './MathUtils.js';
import { findNearestTarget } from './TargetingSystem.js';
export class PlayerAutoAttackSystem {
    cooldownMs = 0;
    reset() {
        this.cooldownMs = 0;
    }
    update(deltaMs, player, stats, targets) {
        this.cooldownMs -= deltaMs;
        const intervalMs = 1000 / stats.fireRate;
        if (this.cooldownMs > 0)
            return [];
        const target = findNearestTarget(player, targets);
        if (!target) {
            this.cooldownMs = 0;
            return [];
        }
        const baseAngle = angleBetween(player, target);
        const spread = degToRad(stats.bulletSpread);
        const count = Math.max(1, Math.floor(stats.bulletCount));
        const commands = [];
        for (let index = 0; index < count; index += 1) {
            const offset = count === 1 ? 0 : -spread / 2 + (spread * index) / (count - 1);
            const angle = baseAngle + offset;
            commands.push({
                x: player.x,
                y: player.y - 20,
                vx: Math.cos(angle) * stats.bulletSpeed,
                vy: Math.sin(angle) * stats.bulletSpeed,
                damage: stats.damage,
                owner: 'player',
            });
        }
        this.cooldownMs += intervalMs;
        if (this.cooldownMs < 0)
            this.cooldownMs = intervalMs;
        return commands;
    }
}
//# sourceMappingURL=PlayerAutoAttackSystem.js.map