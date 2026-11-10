import type { GameResult } from '../lib/types';

// Datos de EJEMPLO para que las pantallas no se vean vacías mientras llegan los participantes.
// Solo se muestran si no hay ningún resultado real; con la primera partida real desaparecen solos.
// Para desactivarlo: SHOW_DEMO_WHEN_EMPTY = false.
export const SHOW_DEMO_WHEN_EMPTY = true;

const demo = (n: number, teamName: string, players: string[], timeMs: number, errors: number): GameResult => ({
  id: `demo-${n}`,
  teamId: `demo-${n}`,
  teamName,
  players,
  box: ((n % 3) + 1) as 1 | 2 | 3,
  timeMs,
  penaltyMs: errors * 5000,
  errors,
  scanned: 10,
  finished: true,
  order: [],
});

export const DEMO_RESULTS: readonly GameResult[] = [
  demo(1, 'Polar Express', ['Carlos', 'María'], 24_800, 0),
  demo(2, 'Titanes del Barcode', ['Andrés', 'Luisa'], 28_400, 0),
  demo(3, 'Escáner Alfa', ['Pedro', 'Valentina'], 31_200, 1),
  demo(4, 'Rayo GS1', ['José', 'Daniela'], 36_900, 0),
  demo(5, 'Código Veloz', ['Miguel', 'Sofía'], 42_300, 2),
];
