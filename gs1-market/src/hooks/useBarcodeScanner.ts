import { useEffect, useRef } from 'react';

/**
 * Pistolas USB/HID: "teclean" los dígitos del código y terminan con Enter.
 * Escucha el teclado a nivel de ventana, así que funciona aunque ningún campo tenga el foco.
 * Si hay un <input> enfocado, no interfiere: ese campo recibe el texto por sí mismo.
 */
export function useBarcodeScanner(onScan: (code: string) => void, enabled = true): void {
  const buffer = useRef('');
  const handler = useRef(onScan);
  handler.current = onScan;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (e.key === 'Enter') {
        const code = buffer.current;
        buffer.current = '';
        if (code) handler.current(code);
      } else if (/^\d$/.test(e.key)) {
        buffer.current += e.key;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
