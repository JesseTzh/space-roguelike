import type { CircleBody, Vector2Like } from '../types/GameTypes.js'

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function distanceSquared(a: Vector2Like, b: Vector2Like): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

export function angleBetween(a: Vector2Like, b: Vector2Like): number {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

export function circlesOverlap(a: CircleBody, b: CircleBody): boolean {
  const radius = a.radius + b.radius
  return distanceSquared(a, b) <= radius * radius
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}
