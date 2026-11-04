import { useMemo, useState } from 'react';
import { BookOpen, ChartColumn, Medal, Play, ShoppingBasket, Timer, Trophy, UsersRound, Zap, X } from 'lucide-react';
import bolsas from '../assets/retail-bolsas.svg';
import { DEMO_RESULTS, SHOW_DEMO_WHEN_EMPTY } from '../data/demoResults';
import { TOTAL_PRODUCTS } from '../data/products';
import { formatClock, formatShort } from '../lib/format';
import { ranking } from '../lib/ranking';
import { MAX_PLAYERS_PER_BOX, MAX_TIME_MS, PENALTY_MS } from '../lib/rules';
import type { AppData } from '../lib/types';

interface Props {
  data: AppData;
  onStart: () => void;
  onRecords: () => void;
}

export function HomeScreen({ data, onStart, onRecords }: Props) {
  const [rulesOpen, setRulesOpen] = useState(false);
  // Mientras no haya resultados reales se muestran datos de ejemplo
  const results = data.results.length === 0 && SHOW_DEMO_WHEN_EMPTY ? DEMO_RESULTS : data.results;
  const top3 = useMemo(() => ranking(results).slice(0, 5), [results]);
  const best = top3[0];
  const record = best?.timeMs;
  const teamsPlayed = new Set(results.map((r) => r.teamId)).size;

  return (
    <div className="relative z-10 grid min-h-0 w-full flex-1 grid-cols-[1.55fr_1fr] gap-8 px-10 py-6">
      {/* Columna izquierda */}
      <div className="flex min-h-0 flex-col gap-4">
        <section className="card-glow relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-3xl bg-white p-9">
          <img src={bolsas} alt="" aria-hidden className="pointer-events-none absolute right-4 top-20 w-[450px] select-none" />
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-extrabold tracking-widest text-gs1-blue">
            <span className="h-2 w-2 rounded-full bg-gs1-orange" /> COMPETICIÓN OFICIAL • GS1 VENEZUELA
          </span>
          <h1 className="mt-5 max-w-[34rem] font-display text-6xl font-extrabold leading-[1.02] tracking-tight text-on-surface">
            La Carrera de Escaneo de <span className="text-gs1-blue">GS1</span>{' '}
            <span className="bg-gradient-to-r from-gs1-fuchsia to-gs1-purple bg-clip-text text-transparent">Market</span>
          </h1>
          <p className="mt-4 max-w-[27rem] text-2xl leading-snug text-on-surface-variant">
            Demuestra la velocidad, precisión y sincronía de tu equipo en la caja registradora de alta tecnología.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Chip>#GS1MARKET</Chip>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5 border-t border-slate-200 pt-5">
            <Stat icon={<ShoppingBasket size={30} />} tone="text-gs1-blue bg-blue-50" value={String(TOTAL_PRODUCTS)} label="Productos" />
            <Stat icon={<UsersRound size={30} />} tone="text-gs1-purple bg-purple-50" value={`${MAX_PLAYERS_PER_BOX}`} label="Por equipo" />
            <Stat icon={<Timer size={30} />} tone="text-gs1-orange bg-orange-50" value="1:30" label="Contra reloj" />
          </div>
        </section>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-5 rounded-3xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-5 font-display text-4xl font-extrabold tracking-wide text-white shadow-lg shadow-gs1-orange/30 transition active:translate-y-0.5"
        >
          <Zap size={36} /> ¡COMENZAR PARTIDA! <Play size={28} />
        </button>

        <div className="grid grid-cols-2 gap-5">
          <GhostButton icon={<ChartColumn size={26} />} onClick={onRecords}>Ver Tabla de Posiciones</GhostButton>
          <GhostButton icon={<BookOpen size={26} />} onClick={() => setRulesOpen(true)}>Reglas Rápidas</GhostButton>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex min-h-0 flex-col gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gs1-blue to-[#0a3f8f] p-8 text-white shadow-lg shadow-gs1-blue/20">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gs1-orange/30 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-extrabold tracking-widest text-white/70"><Medal size={18} /> RÉCORD ACTUAL</div>
              <div className="mt-2 font-display text-6xl font-extrabold tracking-tight">{best ? formatShort(best.timeMs) : '--'}</div>
              <div className="mt-1 text-xl text-white/80">{best ? best.teamName : 'Aún sin récord'}</div>
            </div>
            <Trophy size={84} className="text-gs1-orange/90" />
          </div>
        </section>

        <section className="card-glow flex min-h-0 flex-1 flex-col rounded-3xl bg-white p-7">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold">
              <Trophy size={26} className="text-gs1-blue" /> Tabla de Posiciones Rápida
            </h2>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-gs1-orange ring-1 ring-orange-200">Top 5</span>
          </div>
          <div className="mt-5 flex flex-1 flex-col gap-3">
            {top3.length === 0 && (
              <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 py-10 text-center text-lg text-on-surface-variant">
                Aún no hay resultados. ¡Sé el primer equipo!
              </p>
            )}
            {top3.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${i === 0 ? 'border-yellow-200 bg-yellow-50/60' : 'border-slate-200'}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-extrabold ${['bg-yellow-400 text-yellow-900', 'bg-slate-200 text-slate-700', 'bg-orange-200 text-orange-800'][i] ?? 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                <div className="flex-1">
                  <div className="text-xl font-bold">{r.teamName}</div>
                  <div className="text-sm text-on-surface-variant">{r.players.join(' y ')}{r.errors === 0 ? ' • Sin fallas' : ` • ${r.errors} ${r.errors === 1 ? 'falla' : 'fallas'}`}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-2xl font-extrabold ${i === 0 ? 'text-green-600' : 'text-gs1-blue'}`}>{formatShort(r.timeMs)}</div>
                  <div className="text-xs font-bold text-on-surface-variant">{i === 0 ? 'RÉCORD ACTUAL' : `+${formatShort(r.timeMs - (record ?? 0))}`}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <MiniStat value={teamsPlayed} label={teamsPlayed === 1 ? 'Equipo ha competido' : 'Equipos han competido'} />
            <MiniStat value={results.length} label={results.length === 1 ? 'Partida jugada' : 'Partidas jugadas'} />
          </div>
        </section>
      </div>

      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 text-center">
      <div className="font-display text-4xl font-extrabold text-gs1-blue">{value}</div>
      <div className="text-sm font-bold text-on-surface-variant">{label}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-lg font-semibold text-on-surface">{children}</span>;
}

function Stat({ icon, tone, value, label }: { icon: React.ReactNode; tone: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 py-4">
      <span className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
      <span className="font-display text-5xl font-extrabold">{value}</span>
      <span className="mt-1 text-sm font-bold tracking-widest text-on-surface-variant">{label.toUpperCase()}</span>
    </div>
  );
}

function GhostButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-glow flex items-center justify-center gap-3 rounded-2xl bg-white py-4 text-2xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5">
      {icon} {children}
    </button>
  );
}

function RulesModal({ onClose }: { onClose: () => void }) {
  const rules = [
    `Cada equipo escanea los ${TOTAL_PRODUCTS} productos de la canasta con la pistola lectora.`,
    'La pantalla indica la pista del producto que toca escanear. El orden cambia en cada partida.',
    `Si escaneas un código que no corresponde, se suman ${PENALTY_MS / 1000} segundos a tu tiempo.`,
    `El tiempo máximo es ${formatClock(MAX_TIME_MS).slice(0, 5)}. Gana el equipo que escanee más rápido.`,
    'En caso de empate, se juega una partida extra con un orden totalmente distinto.',
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gs1-blue/80 p-10" onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-3xl border-2 border-gs1-orange bg-white p-10" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-5 top-5 rounded-full p-2 text-on-surface-variant hover:bg-slate-100"><X size={28} /></button>
        <h2 className="font-display text-4xl font-extrabold text-gs1-blue">Reglas Rápidas</h2>
        <ol className="mt-6 space-y-4 text-2xl leading-snug">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-4"><span className="font-display font-extrabold text-gs1-orange">{i + 1}.</span>{r}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
