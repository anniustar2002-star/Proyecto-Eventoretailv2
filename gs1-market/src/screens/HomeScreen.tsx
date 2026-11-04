import { useMemo, useState } from 'react';
import { BookOpen, ChartColumn, Play, Radio, ShoppingBasket, Timer, Trophy, UsersRound, Zap, X } from 'lucide-react';
import { PRODUCTS, TOTAL_PRODUCTS } from '../data/products';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
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
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [read, setRead] = useState<Set<number>>(new Set());
  const [simIndex, setSimIndex] = useState(0);

  const registerScan = (code: string) => {
    setLastCode(code);
    const product = PRODUCTS.find((p) => p.gtin === code);
    if (product) setRead((prev) => new Set(prev).add(product.id));
  };
  // Prueba de la pistola real desde el Inicio
  useBarcodeScanner(registerScan);

  const simulate = () => {
    registerScan(PRODUCTS[simIndex % TOTAL_PRODUCTS].gtin);
    setSimIndex((i) => i + 1);
  };

  const matched = lastCode ? PRODUCTS.find((p) => p.gtin === lastCode) : undefined;
  const top3 = useMemo(() => ranking(data.results).slice(0, 3), [data.results]);
  const record = top3[0]?.timeMs;

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-[1.55fr_1fr] gap-8 px-10 py-8">
      {/* Columna izquierda */}
      <div className="flex flex-col gap-5">
        <section className="card-glow relative overflow-hidden rounded-3xl bg-white p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-extrabold tracking-widest text-gs1-blue">
            <span className="h-2 w-2 rounded-full bg-gs1-orange" /> COMPETICIÓN OFICIAL • GS1 VENEZUELA
          </span>
          <h1 className="mt-8 max-w-[34rem] font-display text-7xl font-extrabold leading-[1.02] tracking-tight text-on-surface">
            La Carrera de Escaneo de <span className="text-gs1-blue">GS1</span>{' '}
            <span className="bg-gradient-to-r from-gs1-fuchsia to-gs1-purple bg-clip-text text-transparent">Market</span>
          </h1>
          <p className="mt-6 max-w-2xl text-2xl leading-snug text-on-surface-variant">
            Demuestra la velocidad, precisión y sincronía de tu equipo en la caja registradora de alta tecnología.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Chip>#GS1MARKET</Chip>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-5 border-t border-slate-200 pt-8">
            <Stat icon={<ShoppingBasket size={30} />} tone="text-gs1-blue bg-blue-50" value={String(TOTAL_PRODUCTS)} label="Productos" />
            <Stat icon={<UsersRound size={30} />} tone="text-gs1-purple bg-purple-50" value={`${MAX_PLAYERS_PER_BOX}`} label="Por equipo" />
            <Stat icon={<Timer size={30} />} tone="text-gs1-orange bg-orange-50" value="1:30" label="Contra reloj" />
          </div>
        </section>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-5 rounded-3xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-7 font-display text-4xl font-extrabold tracking-wide text-white shadow-lg shadow-gs1-orange/30 transition active:translate-y-0.5"
        >
          <Zap size={36} /> ¡COMENZAR PARTIDA! <Play size={28} />
        </button>

        <div className="grid grid-cols-2 gap-5">
          <GhostButton icon={<ChartColumn size={26} />} onClick={onRecords}>Ver Tabla de Posiciones</GhostButton>
          <GhostButton icon={<BookOpen size={26} />} onClick={() => setRulesOpen(true)}>Reglas Rápidas</GhostButton>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-6">
        <section className="card-glow rounded-3xl bg-white p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Prueba de la Pistola Lectora</h2>
              <p className="text-base text-on-surface-variant">Escanea un producto o usa el botón de prueba</p>
            </div>
            <span className="rounded-md bg-green-50 px-3 py-1 text-sm font-extrabold text-green-700 ring-1 ring-green-200">LISTO</span>
          </div>
          <div className="relative mt-5 h-60 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="barcode-pattern absolute inset-x-6 inset-y-12 opacity-80" />
            <div className="laser-line absolute inset-x-0 h-[3px] animate-laser bg-gs1-orange/80" />
            <div className="absolute left-1/2 top-1/2 w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/95 px-5 py-4 text-center shadow-md">
              <div className="font-mono text-2xl font-bold tracking-widest text-gs1-blue">{lastCode ?? 'GS1 · · · · · · · ·'}</div>
              <div className={`mt-1 text-base ${lastCode ? (matched ? 'font-bold text-green-700' : 'font-bold text-red-600') : 'text-on-surface-variant'}`}>
                {lastCode ? (matched ? `✓ ${matched.name}` : 'Código no pertenece a la canasta') : 'Esperando paso por escáner...'}
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
            <button onClick={simulate} className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 py-4 text-xl font-semibold text-on-surface transition hover:bg-slate-100 active:translate-y-0.5">
              <Radio size={22} className="text-gs1-orange" /> Simular Escaneo (Test)
            </button>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-2 text-center">
              <div className="text-xs font-bold tracking-widest text-on-surface-variant">LEÍDOS</div>
              <div className="font-display text-3xl font-extrabold text-gs1-blue">{read.size} / {TOTAL_PRODUCTS}</div>
            </div>
          </div>
        </section>

        <section className="card-glow flex-1 rounded-3xl bg-white p-7">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold">
              <Trophy size={26} className="text-gs1-blue" /> Tabla de Posiciones Rápida
            </h2>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-gs1-orange ring-1 ring-orange-200">Top 3</span>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {top3.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-lg text-on-surface-variant">
                Aún no hay resultados. ¡Sé el primer equipo!
              </p>
            )}
            {top3.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${i === 0 ? 'border-yellow-200 bg-yellow-50/60' : 'border-slate-200'}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-extrabold ${['bg-yellow-400 text-yellow-900', 'bg-slate-200 text-slate-700', 'bg-orange-200 text-orange-800'][i]}`}>{i + 1}</span>
                <div className="flex-1">
                  <div className="text-xl font-bold">{r.teamName}</div>
                  <div className="text-sm text-on-surface-variant">{r.players.join(' y ')}{r.errors === 0 ? ' • Sin fallas' : ` • ${r.errors} fallas`}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-2xl font-extrabold ${i === 0 ? 'text-green-600' : 'text-gs1-blue'}`}>{formatShort(r.timeMs)}</div>
                  <div className="text-xs font-bold text-on-surface-variant">{i === 0 ? 'RÉCORD ACTUAL' : `+${formatShort(r.timeMs - (record ?? 0))}`}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-3 text-base">
            <b>{data.teams.length}</b> {data.teams.length === 1 ? 'equipo registrado' : 'equipos registrados'}
          </div>
        </section>
      </div>

      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-lg font-semibold text-on-surface">{children}</span>;
}

function Stat({ icon, tone, value, label }: { icon: React.ReactNode; tone: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 py-6">
      <span className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
      <span className="font-display text-5xl font-extrabold">{value}</span>
      <span className="mt-1 text-sm font-bold tracking-widest text-on-surface-variant">{label.toUpperCase()}</span>
    </div>
  );
}

function GhostButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-glow flex items-center justify-center gap-3 rounded-2xl bg-white py-5 text-2xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5">
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
