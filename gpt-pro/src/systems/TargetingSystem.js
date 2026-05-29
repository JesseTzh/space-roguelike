import { distanceSquared } from './MathUtils.js';
export function findNearestTarget(player, targets) {
    let best;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const target of targets) {
        if (!target.active || target.dead)
            continue;
        const distance = distanceSquared(player, target);
        if (distance < bestDistance) {
            best = target;
            bestDistance = distance;
            continue;
        }
        if (distance === bestDistance && best) {
            if (target.y > best.y || (target.y === best.y && target.createdAt < best.createdAt))
                best = target;
        }
    }
    return best;
}
//# sourceMappingURL=TargetingSystem.js.map