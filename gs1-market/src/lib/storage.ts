import type { AppData } from './types';

declare global {
  interface Window {
    /** Expuesto por electron/preload.cjs; no existe en el navegador */
    gs1Store?: {
      load: () => Promise<AppData | null>;
      save: (data: AppData) => Promise<boolean>;
    };
  }
}

export const EMPTY_DATA: AppData = { teams: [], results: [] };
const KEY = 'gs1-market-data';

export async function loadData(): Promise<AppData> {
  try {
    if (window.gs1Store) return (await window.gs1Store.load()) ?? EMPTY_DATA;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppData) : EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    if (window.gs1Store) await window.gs1Store.save(data);
    else localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.error('No se pudo guardar', error);
  }
}
