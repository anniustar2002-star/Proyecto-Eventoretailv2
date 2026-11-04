export function Placeholder({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="font-display text-5xl font-extrabold text-gs1-blue">{title}</h1>
      <p className="text-2xl text-on-surface-variant">Pantalla pendiente de construir.</p>
      <button onClick={onBack} className="rounded-2xl bg-gs1-blue px-8 py-4 text-xl font-bold text-white">Volver al inicio</button>
    </div>
  );
}
