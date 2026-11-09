import { useState } from 'react';
import { ArrowLeft, ClipboardList, Crown, RotateCcw, Swords, Trophy } from 'lucide-react';
import { TOTAL_PRODUCTS } from '../data/products';
import { formatClock } from '../lib/format';
import { ranking, tiebreakPending } from '../lib/ranking';
import type { AppData, GameResult } from '../lib/types';

interface Props {
  data: AppData;
  onHome: () => void;
  /** true si el juego ya terminó: el botón pasa a "Nuevo juego" y empieza desde cero */
  completed: boolean;
  onRegister: () => void;
  onTiebreak: () => void;
  onResetResults: () => void;
}

const MEDAL = [
  { ring: 'from-yellow-300 to-amber-500', text: 'text-amber-600', bg: 'from-yellow-100 to-amber-50', label: 'ORO', badge: 'bg-yellow-400 text-yellow-900' },
  { ring: 'from-slate-300 to-slate-400', text: 'text-slate-500', bg: 'from-slate-100 to-white', label: 'PLATA', badge: 'bg-slate-200 text-slate-700' },
  { ring: 'from-orange-300 to-orange-500', text: 'text-orange-600', bg: 'from-orange-100 to-orange-50', label: 'BRONCE', badge: 'bg-orange-200 text-orange-800' },
];

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function LeaderboardScreen({ data, completed, onHome, onRegister, onTiebreak, onResetResults }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const ranked = ranking(data.results);
  const leader = ranked[0];
  const pending = tiebreakPending(data.results);
  const pendingNames = pending ? pending.teamIds.map((id) => data.teams.find((t) => t.id === id)?.name ?? ranked.find((r) => r.teamId === id)?.teamName ?? '').filter(Boolean) : [];
  const hadTiebreak = (teamId: string) => data.results.some((r) => r.teamId === teamId && r.tiebreak);
  const attempts = (teamId: string) => data.results.filter((r) => r.teamId === teamId && !r.tiebreak).length;
  // Orden del podio: 2º, 1º, 3º
  const podium = [ranked[1], ranked[0], ranked[2]].map((r, i) => (r ? { r, place: [1, 0, 2][i] } : null));

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 px-10 py-6">
      <div className="flex items-center justify-between portrait:flex-col portrait:items-start portrait:gap-4">
        <div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-on-surface">Tabla de Posiciones</h1>
          <p className="mt-1 text-xl text-on-surface-variant">Gana el equipo que escanee más rápido. Se cuentan las penalizaciones.</p>
        </div>
        <div className="flex items-center gap-4 portrait:flex-wrap">
          <button onClick={onRegister} className="card-glow flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5"><ClipboardList size={24} /> {completed ? 'Nuevo juego' : 'Registro'}</button>
          <button onClick={() => setConfirmReset(true)} disabled={data.results.length === 0} className="card-glow flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-red-600 transition enabled:hover:bg-red-50 enabled:active:translate-y-0.5 disabled:opacity-40"><RotateCcw size={24} /> Reiniciar resultados</button>
          <button onClick={onHome} className="card-glow flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5"><ArrowLeft size={24} /> Inicio</button>
        </div>
      </div>

      {pending && (
        <div className="flex items-center justify-between portrait:flex-col portrait:items-start portrait:gap-3 rounded-2xl border-2 border-gs1-orange bg-orange-50 px-8 py-4">
          <div className="flex items-center gap-4 text-2xl font-semibold text-gs1-orange"><Swords size={32} /> ¡Empate en el primer puesto! Desempate pendiente: {pendingNames.join(' y ')}</div>
          <button onClick={onTiebreak} className="rounded-2xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia px-8 py-3 font-display text-2xl font-extrabold text-white shadow-md shadow-gs1-orange/30 transition active:translate-y-0.5">Jugar desempate</button>
        </div>
      )}

      {ranked.length === 0 ? (
        <div className="card-glow flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-white text-center">
          <Trophy size={96} className="text-slate-300" />
          <p className="font-display text-4xl font-extrabold text-gs1-blue">Aún no hay resultados</p>
          <p className="text-2xl text-on-surface-variant">Cuando los equipos terminen su partida, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.15fr] gap-6 portrait:grid-cols-1 portrait:grid-rows-[auto_1fr] portrait:gap-5">
          {/* Podio */}
          <section className="card-glow flex min-h-0 flex-col rounded-3xl bg-white p-8 portrait:min-h-[640px] portrait:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-3 font-display text-3xl font-bold"><Trophy className="text-gs1-blue" size={30} /> Podio</h2>
              <span className="rounded-full bg-orange-50 px-4 py-1 text-sm font-bold text-gs1-orange ring-1 ring-orange-200">{pending ? 'PROVISIONAL' : 'OFICIAL'}</span>
            </div>
            <div className="mt-4 flex flex-1 items-end justify-center gap-4">
              {podium.map((slot, i) => {
                if (!slot) return <div key={i} className="w-48" />;
                const { r, place } = slot;
                const m = MEDAL[place];
                // altura por puesto: oro (el más alto), plata, bronce
                const heights = ['h-64', 'h-44', 'h-32'];
                return (
                  <div key={r.teamId} className="flex w-52 flex-col items-center">
                    {place === 0 && <Crown size={44} className="pop mb-1 text-amber-500" />}
                    <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${m.ring} p-1.5 shadow-lg`}>
                      <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-white font-display text-4xl font-extrabold text-gs1-blue">{initials(r.teamName)}</div>
                    </div>
                    <div className="mt-3 text-center font-display text-2xl font-extrabold leading-tight">{r.teamName}</div>
                    <div className={`font-mono text-3xl font-extrabold ${m.text}`}>{r.finished ? formatClock(r.timeMs) : `${r.scanned}/${TOTAL_PRODUCTS}`}</div>
                    <div className={`mt-3 flex w-full ${heights[place]} flex-col items-center justify-start rounded-t-2xl bg-gradient-to-b ${m.bg} pt-4 ring-1 ring-slate-200`}>
                      <span className={`font-display text-5xl font-extrabold ${m.text}`}>{place + 1}º</span>
                      <span className={`mt-1 rounded-full px-3 py-0.5 text-xs font-extrabold tracking-widest ${m.badge}`}>{m.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tabla */}
          <section className="card-glow flex min-h-0 flex-col rounded-3xl bg-white p-8 portrait:p-6">
            <div className="grid grid-cols-[4rem_1fr_9rem_7rem_14rem] portrait:grid-cols-[3rem_1fr_8rem_5.5rem_10.5rem] items-center gap-3 border-b border-slate-200 pb-3 text-sm font-extrabold tracking-widest portrait:tracking-wider text-on-surface-variant">
              <span className="text-center">#</span><span>EQUIPO</span><span className="text-center">PRODUCTOS</span><span className="text-center">FALTAS</span><span className="text-right">TIEMPO</span>
            </div>
            <ol className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
              {ranked.map((r, i) => <Row key={r.teamId} r={r} index={i} leader={leader} tiebreak={hadTiebreak(r.teamId)} attempts={attempts(r.teamId)} />)}
            </ol>
            <p className="mt-3 text-lg text-on-surface-variant">Se muestra la mejor partida de cada equipo. Código equivocado: +5 s. Si no se completan los 10 productos, cuenta el número de productos y luego el tiempo.</p>
          </section>
        </div>
      )}

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gs1-blue/80 p-10" onClick={() => setConfirmReset(false)}>
          <div className="w-full max-w-[720px] rounded-3xl border-2 border-gs1-orange bg-white p-10 text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-4xl font-extrabold text-gs1-blue">¿Reiniciar los resultados?</h2>
            <p className="mt-3 text-2xl text-on-surface-variant">Se borrarán todos los tiempos. Los equipos registrados se mantienen. No se puede deshacer.</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button onClick={() => setConfirmReset(false)} className="rounded-2xl border-2 border-slate-300 py-4 text-2xl font-bold text-on-surface-variant hover:bg-slate-50">Cancelar</button>
              <button onClick={() => { onResetResults(); setConfirmReset(false); }} className="rounded-2xl bg-red-600 py-4 text-2xl font-bold text-white">Sí, borrar todo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ r, index, leader, tiebreak, attempts }: { r: GameResult; index: number; leader: GameResult; tiebreak: boolean; attempts: number }) {
  const first = index === 0;
  const diff = !first && r.finished && leader.finished ? r.timeMs - leader.timeMs : null;
  return (
    <li className={`grid flex-1 grid-cols-[4rem_1fr_9rem_7rem_14rem] portrait:grid-cols-[3rem_1fr_8rem_5.5rem_10.5rem] items-center gap-3 rounded-2xl border px-2 ${first ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white' : 'border-slate-200'}`}>
      <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl font-display text-2xl font-extrabold ${MEDAL[index]?.badge ?? 'bg-slate-100 text-slate-500'}`}>{index + 1}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`break-words font-display font-extrabold leading-tight ${r.teamName.length > 22 ? 'text-2xl' : 'text-3xl'}`}>{r.teamName}</span>
          {first && <span className="rounded-md bg-gs1-orange px-2 py-0.5 text-xs font-extrabold tracking-widest text-white">LÍDER</span>}
          {tiebreak && <span className="rounded-md bg-gs1-purple/15 px-2 py-0.5 text-xs font-extrabold tracking-widest text-gs1-purple">DESEMPATE</span>}
        </div>
        <div className="text-lg leading-snug text-on-surface-variant">
          {r.players.length > 1 || r.players[0] !== r.teamName ? `${r.players.join(' y ')} • ` : ''}{attempts} {attempts === 1 ? 'partida' : 'partidas'}
        </div>
      </div>
      <span className={`text-center font-display text-2xl font-extrabold ${r.finished ? 'text-gs1-green' : 'text-gs1-orange'}`}>{r.scanned} / {TOTAL_PRODUCTS}</span>
      <span className={`text-center text-2xl font-bold ${r.errors ? 'text-red-600' : 'text-on-surface-variant'}`}>{r.errors}</span>
      <div className="text-right">
        <div className="font-mono text-3xl font-extrabold text-gs1-blue">{r.finished ? formatClock(r.timeMs) : <span className="text-2xl text-gs1-orange">No terminó</span>}</div>
        <div className="text-sm font-bold text-on-surface-variant">{first ? 'MEJOR TIEMPO' : diff !== null ? `+${(diff / 1000).toFixed(2)} s` : '—'}</div>
      </div>
    </li>
  );
}
