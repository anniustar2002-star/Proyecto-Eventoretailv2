import type { BoxId } from './rules';

export interface Team {
  id: string;
  name: string;
  /** 1 o 2 integrantes (se guardan los nombres) */
  players: string[];
  box: BoxId;
}

export interface GameResult {
  id: string;
  teamId: string;
  teamName: string;
  players: string[];
  box: BoxId;
  /** tiempo final = tiempo de escaneo + penalizaciones */
  timeMs: number;
  penaltyMs: number;
  errors: number;
  scanned: number;
  finished: boolean;
  /** índices de PRODUCTS en el orden que se pidieron */
  order: number[];
  /** 0/undefined = partida normal; 1, 2... = ronda de desempate */
  tiebreak?: number;
}

export interface AppData {
  teams: Team[];
  results: GameResult[];
}
