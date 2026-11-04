import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../data/products';
import { isValidGtin } from './gtin';
import { differentOrder, shuffledOrder } from './order';
import { ranking, tiedForFirst } from './ranking';
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
  it('detecta empate en el primer puesto', () => {
    expect(tiedForFirst(ranking([result('A', 30000), result('B', 30000), result('C', 40000)]))).toHaveLength(2);
    expect(tiedForFirst(ranking([result('A', 30000), result('B', 31000)]))).toHaveLength(0);
  });
});

describe('formato', () => {
  it('formatClock', () => {
    expect(formatClock(83450)).toBe('01:23.45');
    expect(formatClock(0)).toBe('00:00.00');
  });
});
