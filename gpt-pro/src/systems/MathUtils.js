export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
export function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
}
export function angleBetween(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}
export function circlesOverlap(a, b) {
    const radius = a.radius + b.radius;
    return distanceSquared(a, b) <= radius * radius;
}
export function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
}
export function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safe / 60);
    const rest = safe % 60;
    return `${minutes}:${rest.toString().padStart(2, '0')}`;
}
//# sourceMappingURL=MathUtils.js.map