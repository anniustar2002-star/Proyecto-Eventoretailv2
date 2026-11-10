/** 83450 -> "01:23.45" (minutos:segundos.centésimas) */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 10));
  const cs = String(total % 100).padStart(2, '0');
  const s = String(Math.floor(total / 100) % 60).padStart(2, '0');
  const m = String(Math.floor(total / 6000)).padStart(2, '0');
  return `${m}:${s}.${cs}`;
}

/** 24800 -> "24.8s"; a partir de 1 minuto usa el formato de reloj. */
export function formatShort(ms: number): string {
  return ms >= 60_000 ? formatClock(ms) : `${(ms / 1000).toFixed(1)}s`;
}
