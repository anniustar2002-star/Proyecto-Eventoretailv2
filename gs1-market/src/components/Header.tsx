import { useEffect, useState } from 'react';
import logo from '../assets/logo-gs1-venezuela.png';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  // Solo la hora: la fecha del evento no se muestra
  return now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function Header() {
  const time = useClock();
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-10 py-4 backdrop-blur">
      <div className="flex items-center gap-5">
        <img src={logo} alt="GS1 Venezuela" className="h-16 w-auto" />
        <div className="font-display text-4xl font-extrabold tracking-tight">
          <span className="text-gs1-blue">GS1</span> <span className="text-gs1-orange">Market</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2 text-lg font-bold tracking-wide text-green-800">
          <span className="h-3 w-3 rounded-full bg-gs1-green" /> ARENA EN VIVO
        </span>
        <span className="font-mono text-2xl font-semibold text-gs1-blue">{time}</span>
      </div>
    </header>
  );
}
