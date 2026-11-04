import { useEffect, useState, type ReactNode } from 'react';

// Lienzo fijo de 1920x1080 que se escala para caber SIEMPRE en la ventana (TV, monitor, laptop),
// sin scroll y con las mismas proporciones en cualquier pantalla.
export const STAGE_W = 1920;
export const STAGE_H = 1080;

function useFitScale() {
  const calc = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}

export function Stage({ children }: { children: ReactNode }) {
  const scale = useFitScale();
  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 flex flex-col overflow-hidden"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
