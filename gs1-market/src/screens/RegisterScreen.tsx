import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bath, Bean, Candy, Cuboid, Cylinder, Droplet, Milk, Pill, Pipette, Play, UserMinus, UserPlus, Wheat, type LucideIcon } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { BOXES, MAX_TIME_MS, PENALTY_MS, type BoxId } from '../lib/rules';
import { formatClock } from '../lib/format';
import type { AppData, Team } from '../lib/types';

const PRODUCT_ICONS: Record<number, LucideIcon> = {
  1: Milk, 2: Cuboid, 3: Wheat, 4: Bean, 5: Droplet, 6: Cylinder, 7: Pipette, 8: Bath, 9: Pill, 10: Candy,
};

const BOX_STYLE: Record<BoxId, { badge: string; ring: string; soft: string }> = {
  1: { badge: 'bg-gs1-blue text-white', ring: 'ring-gs1-blue/30', soft: 'bg-blue-50' },
  2: { badge: 'bg-gs1-orange text-white', ring: 'ring-gs1-orange/30', soft: 'bg-orange-50' },
  3: { badge: 'bg-gs1-purple text-white', ring: 'ring-gs1-purple/30', soft: 'bg-purple-50' },
};

interface Draft {
  active: boolean;
  id: string;
  name: string;
  p1: string;
  p2: string;
  twoPlayers: boolean;
}

const emptyDraft = (): Draft => ({ active: false, id: '', name: '', p1: '', p2: '', twoPlayers: false });

function draftFromTeam(team?: Team): Draft {
  if (!team) return emptyDraft();
  return { active: true, id: team.id, name: team.name, p1: team.players[0] ?? '', p2: team.players[1] ?? '', twoPlayers: team.players.length > 1 };
}

const isReady = (d: Draft) => d.active && d.name.trim() !== '' && d.p1.trim() !== '' && (!d.twoPlayers || d.p2.trim() !== '');

interface Props {
  data: AppData;
  onSaveTeams: (teams: Team[]) => void;
  onPlay: (teamId: string) => void;
  onBack: () => void;
}

export function RegisterScreen({ data, onSaveTeams, onPlay, onBack }: Props) {
  const [drafts, setDrafts] = useState<Record<BoxId, Draft>>(() => ({
    1: draftFromTeam(data.teams.find((t) => t.box === 1)),
    2: draftFromTeam(data.teams.find((t) => t.box === 2)),
    3: draftFromTeam(data.teams.find((t) => t.box === 3)),
  }));

  const names = BOXES.map((b) => drafts[b].name.trim().toLowerCase()).filter(Boolean);
  const isDuplicate = (b: BoxId) => drafts[b].active && drafts[b].name.trim() !== '' && names.filter((n) => n === drafts[b].name.trim().toLowerCase()).length > 1;
  const ready = (b: BoxId) => isReady(drafts[b]) && !isDuplicate(b);

  // Autoguardado: solo se guardan los equipos completos (y sin nombre repetido)
  const save = useRef(onSaveTeams);
  save.current = onSaveTeams;
  useEffect(() => {
    const teams: Team[] = BOXES.filter((b) => isReady(drafts[b]) && !isDuplicate(b)).map((b) => ({
      id: drafts[b].id,
      name: drafts[b].name.trim(),
      players: [drafts[b].p1.trim(), ...(drafts[b].twoPlayers ? [drafts[b].p2.trim()] : [])],
      box: b,
    }));
    save.current(teams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts]);

  const patch = (b: BoxId, p: Partial<Draft>) => setDrafts((prev) => ({ ...prev, [b]: { ...prev[b], ...p } }));
  const toggle = (b: BoxId) =>
    setDrafts((prev) => ({ ...prev, [b]: prev[b].active ? emptyDraft() : { ...emptyDraft(), active: true, id: `team-${b}-${Date.now()}` } }));
  const activeCount = BOXES.filter((b) => drafts[b].active).length;

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 px-10 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-on-surface">Registro de Equipos</h1>
          <p className="mt-1 text-xl text-on-surface-variant">
            Activa las cajas que se usarán, escribe el nombre del equipo y de sus integrantes (1 o 2 por caja).
          </p>
        </div>
        <button onClick={onBack} className="card-glow flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5">
          <ArrowLeft size={24} /> Volver al inicio
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
        {BOXES.map((b) => (
          <BoxCard key={b} box={b} draft={drafts[b]} ready={ready(b)} duplicate={isDuplicate(b)} onToggle={() => toggle(b)} onChange={(p) => patch(b, p)} onPlay={() => onPlay(drafts[b].id)} />
        ))}
      </div>

      <section className="card-glow rounded-3xl bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-gs1-blue">Canasta de la partida: {PRODUCTS.length} productos</h2>
          <p className="text-lg text-on-surface-variant">
            El orden se sortea en cada partida • Máximo {formatClock(MAX_TIME_MS).slice(0, 5)} • Código equivocado: +{PENALTY_MS / 1000} s
          </p>
        </div>
        <div className="mt-4 grid grid-cols-10 gap-3">
          {PRODUCTS.map((p) => {
            const Icon = PRODUCT_ICONS[p.id];
            return (
              <div key={p.id} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gs1-blue shadow-sm"><Icon size={26} /></span>
                <span className="text-base font-semibold leading-tight">{p.name}</span>
              </div>
            );
          })}
        </div>
      </section>
      {activeCount === 0 && <span className="sr-only">Ninguna caja activa</span>}
    </div>
  );
}

interface BoxProps {
  box: BoxId;
  draft: Draft;
  ready: boolean;
  duplicate: boolean;
  onToggle: () => void;
  onChange: (p: Partial<Draft>) => void;
  onPlay: () => void;
}

function BoxCard({ box, draft, ready, duplicate, onToggle, onChange, onPlay }: BoxProps) {
  const s = BOX_STYLE[box];
  return (
    <section className={`card-glow flex min-h-0 flex-col rounded-3xl p-7 transition ${draft.active ? `bg-white ring-2 ${s.ring}` : 'bg-white/70'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-3xl font-extrabold ${draft.active ? s.badge : 'bg-slate-200 text-slate-400'}`}>{box}</span>
          <div>
            <div className="font-display text-3xl font-extrabold">CAJA {box}</div>
            <div className={`text-sm font-extrabold tracking-widest ${!draft.active ? 'text-slate-400' : ready ? 'text-green-600' : 'text-gs1-orange'}`}>
              {!draft.active ? 'INACTIVA' : ready ? 'LISTA ✓' : 'INCOMPLETA'}
            </div>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={draft.active}
          aria-label={`Activar caja ${box}`}
          onClick={onToggle}
          className={`relative h-9 w-16 rounded-full transition ${draft.active ? 'bg-gs1-green' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${draft.active ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      {!draft.active ? (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center text-xl text-on-surface-variant">
          Activa la caja para<br />registrar un equipo
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col gap-4">
          <Field label="Nombre del equipo" value={draft.name} onChange={(v) => onChange({ name: v })} placeholder="Ej: Polar Express" autoFocus invalid={duplicate} hint={duplicate ? 'Ese nombre ya está en otra caja' : undefined} />
          <Field label="Jugador 1" value={draft.p1} onChange={(v) => onChange({ p1: v })} placeholder="Nombre y apellido" />
          {draft.twoPlayers ? (
            <div className="flex items-end gap-3">
              <div className="flex-1"><Field label="Jugador 2" value={draft.p2} onChange={(v) => onChange({ p2: v })} placeholder="Nombre y apellido" /></div>
              <button onClick={() => onChange({ twoPlayers: false, p2: '' })} aria-label="Quitar segundo jugador" className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><UserMinus size={24} /></button>
            </div>
          ) : (
            <button onClick={() => onChange({ twoPlayers: true })} className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-lg font-semibold text-on-surface-variant hover:bg-slate-50`}>
              <UserPlus size={22} /> Añadir segundo jugador
            </button>
          )}
          <button
            onClick={onPlay}
            disabled={!ready}
            className="mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-4 font-display text-2xl font-extrabold text-white shadow-md shadow-gs1-orange/30 transition enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <Play size={24} /> Jugar con este equipo
          </button>
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, autoFocus, invalid, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; autoFocus?: boolean; invalid?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-extrabold tracking-widest text-on-surface-variant">{label.toUpperCase()}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={40}
        className={`h-14 w-full rounded-xl border-2 bg-white px-4 text-xl outline-none transition focus:border-gs1-blue focus:ring-4 focus:ring-gs1-blue/15 ${invalid ? 'border-red-400' : 'border-slate-300'}`}
      />
      {hint && <span className="mt-1 block text-sm font-semibold text-red-600">{hint}</span>}
    </label>
  );
}
