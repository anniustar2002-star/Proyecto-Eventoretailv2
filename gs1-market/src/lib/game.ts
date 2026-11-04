import { PRODUCTS, TOTAL_PRODUCTS, type Product } from '../data/products';
import { MAX_TIME_MS, PENALTY_MS } from './rules';
import type { GameResult, Team } from './types';

export type Phase = 'ready' | 'countdown' | 'running' | 'finished' | 'timeup';

export interface GameState {
  phase: Phase;
  /** índices de PRODUCTS en el orden de la pista */
  order: number[];
  /** cuántos productos correctos lleva (= posición de la pista actual) */
  index: number;
  errors: number;
  penaltyMs: number;
  /** tiempo total (reloj + penalizaciones) en cada escaneo correcto */
  splits: number[];
  finalMs: number | null;
}

export type ScanOutcome = 'correct' | 'wrong' | 'finished' | 'ignored';

export const initGame = (order: number[]): GameState => ({
  phase: 'ready', order, index: 0, errors: 0, penaltyMs: 0, splits: [], finalMs: null,
});

export const startCountdown = (s: GameState): GameState => (s.phase === 'ready' ? { ...s, phase: 'countdown' } : s);
export const startRunning = (s: GameState): GameState => (s.phase === 'countdown' ? { ...s, phase: 'running' } : s);

/** Tiempo mostrado: reloj + penalizaciones. */
export const totalMs = (s: GameState, elapsedMs: number): number => (s.finalMs ?? Math.min(elapsedMs + s.penaltyMs, MAX_TIME_MS));

export const currentProduct = (s: GameState): Product | undefined => PRODUCTS[s.order[s.index]];

/** Si el tiempo total llega al máximo, la partida se corta. */
export function checkTimeUp(s: GameState, elapsedMs: number): GameState {
  if (s.phase !== 'running' || elapsedMs + s.penaltyMs < MAX_TIME_MS) return s;
  return { ...s, phase: 'timeup', finalMs: MAX_TIME_MS };
}

/** Un código leído: correcto avanza la pista; cualquier otro suma la penalización. */
export function applyScan(s: GameState, rawCode: string, elapsedMs: number): { state: GameState; outcome: ScanOutcome } {
  const code = rawCode.trim();
  if (s.phase !== 'running' || code === '') return { state: s, outcome: 'ignored' };
  const timedOut = checkTimeUp(s, elapsedMs);
  if (timedOut.phase === 'timeup') return { state: timedOut, outcome: 'ignored' };

  if (code === currentProduct(s)?.gtin) {
    const total = Math.round(elapsedMs + s.penaltyMs);
    const index = s.index + 1;
    const splits = [...s.splits, total];
    if (index === TOTAL_PRODUCTS) return { state: { ...s, index, splits, phase: 'finished', finalMs: total }, outcome: 'finished' };
    return { state: { ...s, index, splits }, outcome: 'correct' };
  }
  const penalized = { ...s, errors: s.errors + 1, penaltyMs: s.penaltyMs + PENALTY_MS };
  return { state: checkTimeUp(penalized, elapsedMs), outcome: 'wrong' };
}

export function toResult(s: GameState, team: Team, tiebreak?: number): GameResult {
  return {
    id: `r-${Date.now()}`,
    teamId: team.id,
    teamName: team.name,
    players: team.players,
    box: team.box,
    timeMs: s.finalMs ?? MAX_TIME_MS,
    penaltyMs: s.penaltyMs,
    errors: s.errors,
    scanned: s.index,
    finished: s.phase === 'finished',
    order: s.order,
    ...(tiebreak ? { tiebreak } : {}),
  };
}
