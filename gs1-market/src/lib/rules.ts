// Reglas del juego confirmadas por el usuario (docs/PLAN.md)
export const MAX_TIME_MS = 90_000; // 1:30
export const PENALTY_MS = 5_000; // +5 s por código que no corresponde a la pista
export const MAX_PLAYERS_PER_BOX = 2;
export const BOXES = [1, 2, 3] as const;
export type BoxId = (typeof BOXES)[number];
