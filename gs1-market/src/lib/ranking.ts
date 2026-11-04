import type { GameResult } from './types';

/** Más productos escaneados primero; a igualdad, menor tiempo. */
export function compareResults(a: GameResult, b: GameResult): number {
  if (a.scanned !== b.scanned) return b.scanned - a.scanned;
  return a.timeMs - b.timeMs;
}

/** Mejor resultado de cada equipo, ordenado. */
export function ranking(results: readonly GameResult[]): GameResult[] {
  const best = new Map<string, GameResult>();
  for (const r of results) {
    const current = best.get(r.teamId);
    if (!current || compareResults(r, current) < 0) best.set(r.teamId, r);
  }
  return [...best.values()].sort(compareResults);
}

/** Equipos empatados en el primer puesto (mismo nº de productos y mismo tiempo). */
export function tiedForFirst(sorted: readonly GameResult[]): GameResult[] {
  if (sorted.length < 2) return [];
  const first = sorted[0];
  const tied = sorted.filter((r) => compareResults(r, first) === 0);
  return tied.length > 1 ? tied : [];
}
