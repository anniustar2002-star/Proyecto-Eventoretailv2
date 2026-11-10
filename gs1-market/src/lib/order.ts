export type Rng = () => number;

/** Fisher-Yates. Devuelve un orden aleatorio de 0..n-1. */
export function shuffledOrder(n: number, rng: Rng = Math.random): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Orden totalmente distinto a `previous`: ninguna posición repite el producto
 * que tenía antes (permutación sin puntos fijos). Se usa en el desempate.
 */
export function differentOrder(previous: readonly number[], rng: Rng = Math.random): number[] {
  const n = previous.length;
  if (n < 2) return [...previous];
  for (let attempt = 0; attempt < 1000; attempt++) {
    const candidate = shuffledOrder(n, rng);
    if (candidate.every((value, i) => value !== previous[i])) return candidate;
  }
  // Respaldo determinista: rotar una posición garantiza que ninguna coincide.
  return previous.map((_, i) => previous[(i + 1) % n]);
}
