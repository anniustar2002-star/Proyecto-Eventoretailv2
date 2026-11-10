import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../data/products';
import { isValidGtin } from './gtin';
import { differentOrder, shuffledOrder } from './order';
import { ranking, tiebreakPending, tiedForFirst } from './ranking';
import { applyScan, initGame, startCountdown, startRunning, checkTimeUp } from './game';
import { formatClock } from './format';
import type { GameResult } from './types';

const result = (teamId: string, timeMs: number, scanned = 10): GameResult => ({
  id: teamId + timeMs, teamId, teamName: teamId, players: ['A'], box: 1,
  timeMs, penaltyMs: 0, errors: 0, scanned, finished: scanned === 10, order: [],
});

describe('productos', () => {
  it('son 10 y todos los GTIN son válidos y únicos', () => {
    expect(PRODUCTS).toHaveLength(10);
    expect(PRODUCTS.every((p) => isValidGtin(p.gtin))).toBe(true);
    expect(new Set(PRODUCTS.map((p) => p.gtin)).size).toBe(10);
  });
  it('rechaza GTIN con dígito verificador incorrecto', () => {
    expect(isValidGtin('7599990011171')).toBe(false);
    expect(isValidGtin('abc')).toBe(false);
  });
});

describe('orden', () => {
  it('shuffledOrder es una permutación', () => {
    expect([...shuffledOrder(10)].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it('differentOrder no repite ninguna posición', () => {
    for (let i = 0; i < 200; i++) {
      const prev = shuffledOrder(10);
      const next = differentOrder(prev);
      expect(next.every((v, k) => v !== prev[k])).toBe(true);
      expect([...next].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  });
});

describe('ranking', () => {
  it('gana el menor tiempo y usa el mejor resultado de cada equipo', () => {
    const r = ranking([result('A', 30000), result('A', 25000), result('B', 28000)]);
    expect(r.map((x) => x.teamId)).toEqual(['A', 'B']);
    expect(r[0].timeMs).toBe(25000);
  });
  it('quien escaneó más productos va primero aunque tarde más', () => {
    const r = ranking([result('A', 90000, 7), result('B', 80000, 5)]);
    expect(r[0].teamId).toBe('A');
  });
  it('detecta empate en el primer puesto y la ronda de desempate', () => {
    expect(tiedForFirst([result('A', 30000), result('B', 30000), result('C', 40000)])).toEqual({ teamIds: ['A', 'B'], round: 1 });
    expect(tiedForFirst([result('A', 30000), result('B', 31000)])).toBeNull();
  });
  it('el desempate lo decide la ronda extra', () => {
    const tb = (id: string, ms: number, round: number): GameResult => ({ ...result(id, ms), tiebreak: round });
    const base = [result('A', 30000), result('B', 30000), result('C', 40000)];
    const r = ranking([...base, tb('A', 28000, 1), tb('B', 27000, 1)]);
    expect(r.map((x) => x.teamId)).toEqual(['B', 'A', 'C']);
    expect(tiedForFirst([...base, tb('A', 28000, 1), tb('B', 27000, 1)])).toBeNull();
    // si solo jugó uno, el otro sigue pendiente
    expect(tiedForFirst([...base, tb('A', 28000, 1)])).toEqual({ teamIds: ['A', 'B'], round: 1 });
    expect(tiebreakPending([...base, tb('A', 28000, 1)])).toEqual({ round: 1, teamIds: ['B'] });
    expect(tiebreakPending([...base, tb('A', 28000, 1), tb('B', 28000, 1)])).toEqual({ round: 2, teamIds: ['A', 'B'] });
    // si vuelven a empatar, toca la ronda 2
    expect(tiedForFirst([...base, tb('A', 28000, 1), tb('B', 28000, 1)])).toEqual({ teamIds: ['A', 'B'], round: 2 });
  });
});

describe('partida', () => {
  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const running = () => startRunning(startCountdown(initGame(order)));
  it('no acepta escaneos antes de empezar', () => {
    expect(applyScan(initGame(order), PRODUCTS[0].gtin, 0).outcome).toBe('ignored');
  });
  it('un código correcto avanza la pista', () => {
    const { state, outcome } = applyScan(running(), PRODUCTS[0].gtin, 1500);
    expect(outcome).toBe('correct');
    expect(state.index).toBe(1);
    expect(state.splits).toEqual([1500]);
  });
  it('un código equivocado suma 5 s y no avanza (también un GTIN válido de otro producto)', () => {
    const { state, outcome } = applyScan(running(), PRODUCTS[5].gtin, 1000);
    expect(outcome).toBe('wrong');
    expect(state.penaltyMs).toBe(5000);
    expect(state.errors).toBe(1);
    expect(state.index).toBe(0);
  });
  it('termina al escanear los 10 y el tiempo incluye penalizaciones', () => {
    let s = running();
    s = applyScan(s, 'xxx', 500).state;
    let last;
    for (let i = 0; i < 10; i++) last = applyScan(s, PRODUCTS[order[i]].gtin, 1000 + i * 100), (s = last.state);
    expect(last!.outcome).toBe('finished');
    expect(s.phase).toBe('finished');
    expect(s.finalMs).toBe(1900 + 5000);
  });
  it('se corta al llegar a 1:30', () => {
    expect(checkTimeUp(running(), 89_999).phase).toBe('running');
    const s = checkTimeUp(running(), 90_000);
    expect(s.phase).toBe('timeup');
    expect(s.finalMs).toBe(90_000);
  });
  it('las penalizaciones cuentan para el máximo', () => {
    expect(checkTimeUp({ ...running(), penaltyMs: 10_000 }, 80_000).phase).toBe('timeup');
  });
});

describe('formato', () => {
  it('formatClock', () => {
    expect(formatClock(83450)).toBe('01:23.45');
    expect(formatClock(0)).toBe('00:00.00');
  });
});
