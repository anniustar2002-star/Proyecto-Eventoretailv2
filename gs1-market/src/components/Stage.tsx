import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Lienzo fijo que se escala para caber SIEMPRE en la ventana (TV, monitor, laptop), sin scroll.
// Horizontal: 1920x1080. Vertical (TV girada): 1080x1920. Se elige según la orientación de la ventana.
export type Orientation = 'landscape' | 'portrait';
const SIZES: Record<Orientation, { w: number; h: number }> = {
  landscape: { w: 1920, h: 1080 },
  portrait: { w: 1080, h: 1920 },
};

const OrientationContext = createContext<Orientation>('landscape');
export const useOrientation = () => useContext(OrientationContext);

function useStageLayout() {
  const calc = () => {
    const orientation: Orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    const { w, h } = SIZES[orientation];
    return { orientation, w, h, scale: Math.min(window.innerWidth / w, window.innerHeight / h) };
  };
  const [layout, setLayout] = useState(calc);
  useEffect(() => {
    const onResize = () => setLayout(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return layout;
}

export function Stage({ children }: { children: ReactNode }) {
  const { orientation, w, h, scale } = useStageLayout();
  return (
    <OrientationContext.Provider value={orientation}>
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div
          data-orientation={orientation}
          className="absolute left-1/2 top-1/2 flex flex-col overflow-hidden"
          style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </OrientationContext.Provider>
  );
}
