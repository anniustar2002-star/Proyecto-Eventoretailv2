import { useCallback, useRef } from 'react';

export type Beep = 'success' | 'error' | 'tick' | 'go' | 'finish';

/** Sonidos sintetizados con Web Audio (sin archivos de audio, funciona sin internet). */
export function useAudioSynth() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ctx = () => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  };

  const tone = (type: OscillatorType, freq: number, seconds: number, volume: number, delay = 0) => {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    const t0 = c.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + seconds);
    osc.start(t0);
    osc.stop(t0 + seconds);
  };

  const play = useCallback((kind: Beep) => {
    try {
      if (kind === 'success') tone('sine', 1400, 0.09, 0.15);
      else if (kind === 'error') tone('sawtooth', 250, 0.3, 0.2);
      else if (kind === 'tick') tone('sine', 660, 0.12, 0.15);
      else if (kind === 'go') tone('sine', 1320, 0.3, 0.2);
      else {
        tone('sine', 880, 0.15, 0.18);
        tone('sine', 1100, 0.15, 0.18, 0.15);
        tone('sine', 1320, 0.3, 0.18, 0.3);
      }
    } catch {
      /* sin audio disponible: se ignora */
    }
  }, []);

  return play;
}
