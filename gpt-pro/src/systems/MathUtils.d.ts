import type { CircleBody, Vector2Like } from '../types/GameTypes.js';
export declare function clamp(value: number, min: number, max: number): number;
export declare function distanceSquared(a: Vector2Like, b: Vector2Like): number;
export declare function angleBetween(a: Vector2Like, b: Vector2Like): number;
export declare function circlesOverlap(a: CircleBody, b: CircleBody): boolean;
export declare function degToRad(degrees: number): number;
export declare function formatTime(seconds: number): string;
