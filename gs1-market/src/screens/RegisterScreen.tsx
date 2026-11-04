import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Play, Plus, Trash2, User, Users, X } from 'lucide-react';
import { PRODUCT_ICONS } from '../lib/productIcons';
import { productImage } from '../lib/productImages';
import { PRODUCTS } from '../data/products';
import { BOXES, MAX_TIME_MS, PENALTY_MS, type BoxId } from '../lib/rules';
import { formatClock } from '../lib/format';
import type { AppData, Team } from '../lib/types';

const BOX_STYLE: Record<BoxId, { badge: string; ring: string }> = {
  1: { badge: 'bg-gs1-blue text-white', ring: 'ring-gs1-blue/30' },
  2: { badge: 'bg-gs1-orange text-white', ring: 'ring-gs1-orange/30' },
  3: { badge: 'bg-gs1-purple text-white', ring: 'ring-gs1-purple/30' },
};

interface Props {
  data: AppData;
  tiebreakTeamIds: string[];
  onSaveTeams: (teams: Team[]) => void;
  /** inicia el juego con los equipos en orden de caja (o el desempate pendiente) */
  onStartGame: () => void;
  onBack: () => void;
}

type ModalState = { mode: 'create' } | { mode: 'edit'; team: Team } | null;

export function RegisterScreen({ data, tiebreakTeamIds, onSaveTeams, onStartGame, onBack }: Props) {
  const teams = [...data.teams].sort((a, b) => a.box - b.box);
  // Si no hay equipos, se pide crear el primero nada más entrar
  const [modal, setModal] = useState<ModalState>(teams.length === 0 ? { mode: 'create' } : null);
  const freeBox = BOXES.find((b) => !teams.some((t) => t.box === b));

  const closeModal = () => {
    // Cancelar sin ningún equipo creado: no hay nada que registrar, se vuelve al inicio
    if (teams.length === 0) onBack();
    else setModal(null);
  };

  const accept = (name: string, players: string[]) => {
    if (modal?.mode === 'edit') {
      onSaveTeams(data.teams.map((t) => (t.id === modal.team.id ? { ...t, name, players } : t)));
    } else if (freeBox) {
      onSaveTeams([...data.teams, { id: `team-${freeBox}-${Date.now()}`, name, players, box: freeBox }]);
    }
    setModal(null);
  };

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 px-10 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-on-surface">Registro de Equipos</h1>
          <p className="mt-1 text-xl text-on-surface-variant">Cada equipo o participante ocupa una caja (hasta {BOXES.length}). Cuando estén todos, pulsa Iniciar juego.</p>
        </div>
        <div className="flex items-center gap-4">
          {freeBox ? (
            <button onClick={() => setModal({ mode: 'create' })} className="flex items-center gap-3 rounded-2xl bg-gs1-blue px-6 py-4 text-xl font-bold text-white shadow-md transition hover:bg-gs1-blue/90 active:translate-y-0.5">
              <Plus size={24} /> Agregar otro equipo
            </button>
          ) : (
            <span className="rounded-2xl bg-slate-100 px-6 py-4 text-lg font-semibold text-on-surface-variant">Las {BOXES.length} cajas están ocupadas</span>
          )}
          <button onClick={onBack} className="card-glow flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-gs1-blue transition hover:bg-slate-50 active:translate-y-0.5">
            <ArrowLeft size={24} /> Volver al inicio
          </button>
        </div>
      </div>

      {/* Las cajas se centran: 1, 2 o 3 quedan siempre equilibradas */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
       <div className="flex items-stretch justify-center gap-8">
        {teams.map((t) => (
          <TeamCard
            key={t.id}
            team={t}
            tiebreak={tiebreakTeamIds.includes(t.id)}
            onEdit={() => setModal({ mode: 'edit', team: t })}
            onDelete={() => onSaveTeams(data.teams.filter((x) => x.id !== t.id))}
          />
        ))}
       </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onStartGame}
          disabled={teams.length === 0}
          className="flex items-center justify-center gap-4 rounded-3xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia px-16 py-5 font-display text-4xl font-extrabold text-white shadow-lg shadow-gs1-orange/30 transition enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <Play size={36} /> {tiebreakTeamIds.length > 0 ? 'INICIAR DESEMPATE' : 'INICIAR JUEGO'}
        </button>
        {teams.length > 0 && (
          <p className="text-lg text-on-surface-variant">
            Orden de juego: {(tiebreakTeamIds.length > 0 ? teams.filter((t) => tiebreakTeamIds.includes(t.id)) : teams).map((t) => `Caja ${t.box} (${t.name})`).join('  →  ')}
          </p>
        )}
      </div>

      <section className="card-glow rounded-3xl bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-gs1-blue">Canasta de la partida: {PRODUCTS.length} productos</h2>
          <p className="text-lg text-on-surface-variant">
            El orden se sortea en cada partida • Máximo {formatClock(MAX_TIME_MS).slice(0, 5)} • Código equivocado: +{PENALTY_MS / 1000} s
          </p>
        </div>
        <div className="mt-4 grid grid-cols-10 gap-3">
          {PRODUCTS.map((p) => {
            const Icon = PRODUCT_ICONS[p.id];
            const image = productImage(p.id);
            return (
              <div key={p.id} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center">
                {image ? (
                  <img src={image} alt="" className="h-14 w-14 object-contain" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gs1-blue shadow-sm"><Icon size={26} /></span>
                )}
                <span className="text-base font-semibold leading-tight">{p.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {modal && (
        <TeamModal
          key={modal.mode === 'edit' ? modal.team.id : 'new'}
          box={modal.mode === 'edit' ? modal.team.box : (freeBox as BoxId)}
          initial={modal.mode === 'edit' ? modal.team : undefined}
          takenNames={data.teams.filter((t) => modal.mode !== 'edit' || t.id !== modal.team.id).map((t) => t.name.trim().toLowerCase())}
          onCancel={closeModal}
          onAccept={accept}
        />
      )}
    </div>
  );
}

function TeamCard({ team, tiebreak, onEdit, onDelete }: { team: Team; tiebreak: boolean; onEdit: () => void; onDelete: () => void }) {
  const s = BOX_STYLE[team.box];
  const solo = team.players.length === 1 && team.players[0] === team.name;
  const [confirming, setConfirming] = useState(false);
  return (
    <section className={`card-glow flex w-[540px] flex-col rounded-3xl bg-white p-7 ring-2 ${s.ring}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-3xl font-extrabold ${s.badge}`}>{team.box}</span>
          <div className="font-display text-3xl font-extrabold">CAJA {team.box}</div>
          {tiebreak && <span className="rounded-lg bg-gs1-orange px-3 py-1 text-sm font-extrabold tracking-widest text-white">DESEMPATE</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} aria-label="Editar equipo" className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><Pencil size={22} /></button>
          <button onClick={() => setConfirming(true)} aria-label="Eliminar equipo" className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-red-500 hover:bg-red-50"><Trash2 size={22} /></button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-sm font-extrabold tracking-widest text-on-surface-variant">
          {solo ? <User size={18} /> : <Users size={18} />} {solo ? 'PARTICIPANTE INDIVIDUAL' : 'EQUIPO'}
        </div>
        <div className="mt-1 font-display text-4xl font-extrabold leading-tight text-gs1-blue">{team.name}</div>
        {!solo && (
          <ul className="mt-3 space-y-1 text-xl text-on-surface">
            {team.players.map((p, i) => (
              <li key={i} className="flex items-center gap-2"><User size={18} className="text-on-surface-variant" /> {p}</li>
            ))}
          </ul>
        )}
      </div>

      {confirming && (
        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <span className="flex-1 text-lg font-semibold text-red-700">¿Eliminar este equipo?</span>
          <button onClick={() => setConfirming(false)} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-lg font-semibold">No</button>
          <button onClick={onDelete} className="rounded-xl bg-red-600 px-5 py-3 text-lg font-bold text-white">Sí, eliminar</button>
        </div>
      )}
    </section>
  );
}

type Kind = 'solo' | 'pair';

interface ModalProps {
  box: BoxId;
  initial?: Team;
  takenNames: string[];
  onCancel: () => void;
  onAccept: (name: string, players: string[]) => void;
}

function TeamModal({ box, initial, takenNames, onCancel, onAccept }: ModalProps) {
  const isSolo = !initial || (initial.players.length === 1 && initial.players[0] === initial.name);
  const [kind, setKind] = useState<Kind>(initial ? (isSolo ? 'solo' : 'pair') : 'pair');
  const [solo, setSolo] = useState(initial && isSolo ? initial.name : '');
  const [team, setTeam] = useState(initial && !isSolo ? initial.name : '');
  const [p1, setP1] = useState(initial && !isSolo ? initial.players[0] ?? '' : '');
  const [p2, setP2] = useState(initial && !isSolo ? initial.players[1] ?? '' : '');
  const [twoPlayers, setTwoPlayers] = useState(initial && !isSolo ? initial.players.length > 1 : true);

  const name = (kind === 'solo' ? solo : team).trim();
  const duplicate = name !== '' && takenNames.includes(name.toLowerCase());
  const valid = name !== '' && !duplicate && (kind === 'solo' || (p1.trim() !== '' && (!twoPlayers || p2.trim() !== '')));

  const submit = () => {
    if (!valid) return;
    onAccept(name, kind === 'solo' ? [name] : [p1.trim(), ...(twoPlayers ? [p2.trim()] : [])]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gs1-blue/80 p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative w-full max-w-[760px] rounded-3xl border-2 border-gs1-orange bg-white p-10 shadow-2xl"
      >
        <button type="button" onClick={onCancel} aria-label="Cerrar" className="absolute right-5 top-5 rounded-full p-2 text-on-surface-variant hover:bg-slate-100"><X size={28} /></button>
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-3xl font-extrabold ${BOX_STYLE[box].badge}`}>{box}</span>
          <div>
            <h2 className="font-display text-4xl font-extrabold text-gs1-blue">{initial ? 'Editar equipo' : 'Crear equipo'}</h2>
            <p className="text-lg text-on-surface-variant">{initial ? `Caja ${box}` : `Se creará la Caja ${box}`}</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
          {([['pair', 'Equipo', Users], ['solo', 'Individual', User]] as const).map(([k, label, Icon]) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xl font-bold transition ${kind === k ? 'bg-white text-gs1-blue shadow' : 'text-on-surface-variant'}`}>
              <Icon size={22} /> {label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {kind === 'solo' ? (
            <Field label="Nombre del participante" value={solo} onChange={setSolo} placeholder="Ej: Fulanito Pérez" autoFocus invalid={duplicate} hint={duplicate ? 'Ese nombre ya está registrado' : undefined} />
          ) : (
            <>
              <Field label="Nombre del equipo" value={team} onChange={setTeam} placeholder="Ej: Polar Express" autoFocus invalid={duplicate} hint={duplicate ? 'Ese nombre ya está registrado' : undefined} />
              <Field label="Jugador 1" value={p1} onChange={setP1} placeholder="Nombre y apellido" />
              {twoPlayers ? (
                <div className="flex items-end gap-3">
                  <div className="flex-1"><Field label="Jugador 2" value={p2} onChange={setP2} placeholder="Nombre y apellido" /></div>
                  <button type="button" onClick={() => { setTwoPlayers(false); setP2(''); }} aria-label="Quitar segundo jugador" className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><X size={24} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => setTwoPlayers(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-lg font-semibold text-on-surface-variant hover:bg-slate-50">
                  <Plus size={22} /> Añadir segundo jugador
                </button>
              )}
            </>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button type="button" onClick={onCancel} className="rounded-2xl border-2 border-slate-300 py-4 text-2xl font-bold text-on-surface-variant hover:bg-slate-50">Cancelar</button>
          <button type="submit" disabled={!valid} className="rounded-2xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-4 font-display text-2xl font-extrabold text-white shadow-md shadow-gs1-orange/30 transition enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
            Aceptar
          </button>
        </div>
      </form>
    </div>
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
