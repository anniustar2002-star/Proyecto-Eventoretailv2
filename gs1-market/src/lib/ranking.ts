import type { GameResult } from './types';

/** Más productos escaneados primero; a igualdad, menor tiempo. */
export function compareResults(a: GameResult, b: GameResult): number {
  if (a.scanned !== b.scanned) return b.scanned - a.scanned;
  return a.timeMs - b.timeMs;
}

interface Resolved {
  order: GameResult[];
  /** equipos que siguen empatados en el 1er puesto y deben jugar la ronda `round` */
  tied: string[];
  round: number;
}

/** Desempate: los empatados en el 1er puesto juegan rondas extra hasta que uno gane. */
function resolveGroup(group: GameResult[], results: readonly GameResult[], round: number): Resolved {
  const atRound = (teamId: string) => [...results].reverse().find((r) => r.teamId === teamId && r.tiebreak === round);
  const played = group.map((g) => atRound(g.teamId));
  if (played.some((p) => !p)) return { order: group, tied: group.map((g) => g.teamId), round };

  const sorted = group.map((g, i) => ({ g, r: played[i]! })).sort((a, b) => compareResults(a.r, b.r));
  const top = sorted.filter((x) => compareResults(x.r, sorted[0].r) === 0);
  const rest = sorted.slice(top.length).map((x) => x.g);
  if (top.length === 1) return { order: [top[0].g, ...rest], tied: [], round };

  const sub = resolveGroup(top.map((x) => x.g), results, round + 1);
  return { order: [...sub.order, ...rest], tied: sub.tied, round: sub.round };
}

function resolve(results: readonly GameResult[]): Resolved {
  // Mejor partida normal de cada equipo
  const best = new Map<string, GameResult>();
  for (const r of results) {
    if (r.tiebreak) continue;
    const current = best.get(r.teamId);
    if (!current || compareResults(r, current) < 0) best.set(r.teamId, r);
  }
  const sorted = [...best.values()].sort(compareResults);
  const tiedBase = sorted.filter((r) => compareResults(r, sorted[0]) === 0);
  if (sorted.length < 2 || tiedBase.length < 2) return { order: sorted, tied: [], round: 0 };
  const sub = resolveGroup(tiedBase, results, 1);
  return { order: [...sub.order, ...sorted.slice(tiedBase.length)], tied: sub.tied, round: sub.round };
}

/** Mejor resultado de cada equipo, ordenado (incluye el desempate del 1er puesto). */
export function ranking(results: readonly GameResult[]): GameResult[] {
  return resolve(results).order;
}

/** Equipos empatados en el primer puesto y la ronda de desempate que les toca jugar. */
export function tiedForFirst(results: readonly GameResult[]): { teamIds: string[]; round: number } | null {
  const r = resolve(results);
  return r.tied.length > 1 ? { teamIds: r.tied, round: r.round } : null;
}

/** Equipos que aún deben jugar la ronda de desempate vigente (y cuál es). */
export function tiebreakPending(results: readonly GameResult[]): { round: number; teamIds: string[] } | null {
  const tie = tiedForFirst(results);
  if (!tie) return null;
  const teamIds = tie.teamIds.filter((id) => !results.some((r) => r.teamId === id && r.tiebreak === tie.round));
  return teamIds.length ? { round: tie.round, teamIds } : null;
}
