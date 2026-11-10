import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CircleCheck, Flag, Lightbulb, ScanLine, TriangleAlert, X } from 'lucide-react';
import { PRODUCTS, TOTAL_PRODUCTS } from '../data/products';
import { useAudioSynth } from '../hooks/useAudioSynth';
import { applyScan, checkTimeUp, currentProduct, initGame, startCountdown, startRunning, toResult, totalMs, type GameState } from '../lib/game';
import { formatClock } from '../lib/format';
import { differentOrder, shuffledOrder } from '../lib/order';
import { PRODUCT_ICONS } from '../lib/productIcons';
import { productImage } from '../lib/productImages';
import { ranking, tiebreakPending } from '../lib/ranking';
import { MAX_TIME_MS, PENALTY_MS } from '../lib/rules';
import type { AppData, GameResult, Team } from '../lib/types';

interface Props {
  team: Team;
  data: AppData;
  /** ronda de desempate (1, 2...). Sin valor = partida normal */
  tiebreak?: number;
  /** posición en la cola de juego: "Partida 2 de 3" */
  turn: { current: number; total: number };
  /** siguiente equipo de la cola (si queda alguno) */
  nextTeam?: Team;
  onFinish: (result: GameResult) => void;
  onBack: () => void;
  onNext: () => void;
  onTiebreakQueue: () => void;
  onLeaderboard: () => void;
}

const TIPS = [
  'Apunta la pistola al código de barras, a unos 10-15 cm, sin taparlo con la mano.',
  'Un código equivocado suma 5 segundos: es mejor ir seguro que ir apurado.',
  'Fíjate bien en la foto: cada producto tiene su propio código de barras.',
  'Si un producto no lee, gíralo para ver bien su código de barras.',
  'Mantén la pistola firme y escanea un producto a la vez.',
  'Comunícate con tu compañero: uno busca el producto y el otro escanea.',
];

type Flash = { kind: 'ok' | 'bad'; text: string; key: number } | null;

export function ChallengeScreen({ team, data, tiebreak, turn, nextTeam, onFinish, onBack, onNext, onTiebreakQueue, onLeaderboard }: Props) {
  const play = useAudioSynth();
  // En el desempate el orden es totalmente distinto al de la última partida del equipo
  const [game, setGame] = useState<GameState>(() => {
    const last = [...data.results].reverse().find((r) => r.teamId === team.id);
    // Al abrir la partida la cuenta regresiva empieza de inmediato (sin pedir otro clic)
    return startCountdown(initGame(tiebreak && last ? differentOrder(last.order) : shuffledOrder(TOTAL_PRODUCTS)));
  });
  const gameRef = useRef(game);
  gameRef.current = game;
  const startedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [count, setCount] = useState(3);
  const [code, setCode] = useState('');
  const [flash, setFlash] = useState<Flash>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const saved = useRef(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  const update = (next: GameState) => {
    gameRef.current = next;
    setGame(next);
  };

  // Cuenta regresiva 3-2-1
  useEffect(() => {
    if (game.phase !== 'countdown') return;
    setCount(3);
    play('tick');
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCount(n);
        play('tick');
      } else {
        clearInterval(id);
        play('go');
        startedAt.current = performance.now();
        update(startRunning(gameRef.current));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [game.phase === 'countdown']); // eslint-disable-line react-hooks/exhaustive-deps

  // Reloj
  useEffect(() => {
    if (game.phase !== 'running') return;
    let raf = 0;
    const loop = () => {
      const e = performance.now() - startedAt.current;
      setElapsed(e);
      const next = checkTimeUp(gameRef.current, e);
      if (next !== gameRef.current) update(next);
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [game.phase === 'running']); // eslint-disable-line react-hooks/exhaustive-deps

  // El campo de la pistola siempre tiene el foco mientras se juega
  const focusInput = useCallback(() => inputRef.current?.focus(), []);
  useEffect(() => {
    if (game.phase === 'running') focusInput();
  }, [game.phase, focusInput]);

  // Guardar el resultado una sola vez al terminar
  useEffect(() => {
    if ((game.phase === 'finished' || game.phase === 'timeup') && !saved.current) {
      saved.current = true;
      if (game.phase === 'timeup') play('error');
      else play('finish');
      onFinish(toResult(game, team, tiebreak));
    }
  }, [game, team, tiebreak, onFinish, play]);

  const submit = (raw: string) => {
    const e = performance.now() - startedAt.current;
    const before = gameRef.current;
    const { state, outcome } = applyScan(before, raw, e);
    setCode('');
    if (outcome === 'ignored') {
      update(state);
      return;
    }
    update(state);
    setElapsed(e);
    if (outcome === 'wrong') {
      play('error');
      setFlash({ kind: 'bad', text: `Código incorrecto  +${PENALTY_MS / 1000} s`, key: Date.now() });
    } else {
      if (outcome === 'correct') play('success');
      setFlash({ kind: 'ok', text: '✓ ¡Correcto!', key: Date.now() });
    }
  };

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 1300);
    return () => clearTimeout(id);
  }, [flash]);

  const running = game.phase === 'running';
  const over = game.phase === 'finished' || game.phase === 'timeup';
  const total = totalMs(game, elapsed);
  const remaining = MAX_TIME_MS - total;
  const product = currentProduct(game);
  const Icon = product ? PRODUCT_ICONS[product.id] : ScanLine;
  const image = product ? productImage(product.id) : undefined;
  const timeClass = over ? 'text-gs1-blue' : remaining < 5000 && running ? 'alarm' : remaining < 10000 && running ? 'text-gs1-orange' : 'text-on-surface';

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 px-10 py-6">
      {/* Cronómetro */}
      <section className="card-glow grid grid-cols-[1fr_auto_1fr] items-center rounded-3xl bg-white px-10 py-5 portrait:grid-cols-2 portrait:gap-y-3 portrait:px-8">
        <div>
          <div className="text-sm font-extrabold tracking-widest text-on-surface-variant">
            CAJA {team.box} • PARTIDA {turn.current} DE {turn.total}{tiebreak ? ` • DESEMPATE ${tiebreak}` : ''}
          </div>
          <div className="font-display text-4xl font-extrabold leading-tight text-gs1-blue">{team.name}</div>
          {!(team.players.length === 1 && team.players[0] === team.name) && <div className="text-xl text-on-surface-variant">{team.players.join(' y ')}</div>}
        </div>
        <div className="text-center portrait:order-last portrait:col-span-2">
          <div className={`font-mono text-[9rem] font-extrabold leading-none tabular-nums ${timeClass}`}>{formatClock(total)}</div>
          <div className="mt-1 text-lg font-bold tracking-widest text-on-surface-variant">
            LÍMITE {formatClock(MAX_TIME_MS).slice(0, 5)} • FALTAS: <span className={game.errors ? 'text-red-600' : ''}>{game.errors}</span>{game.errors > 0 && ` (+${(game.penaltyMs / 1000).toFixed(0)} s)`}
          </div>
        </div>
        <div className="justify-self-end text-right">
          <div className="text-sm font-extrabold tracking-widest text-on-surface-variant">PRODUCTOS</div>
          <div className="font-display text-7xl font-extrabold text-gs1-green">{game.index}<span className="text-4xl text-on-surface-variant"> / {TOTAL_PRODUCTS}</span></div>
          <div className="mt-2 h-3 w-72 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-gs1-orange via-gs1-purple to-gs1-green transition-all" style={{ width: `${(game.index / TOTAL_PRODUCTS) * 100}%` }} />
          </div>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-6 portrait:grid-cols-1 portrait:grid-rows-[1.1fr_1fr] portrait:gap-5">
        {/* Pista + campo de escaneo */}
        <section className="card-glow relative flex min-h-0 flex-col rounded-3xl bg-white p-8">
            <>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-gs1-orange px-4 py-1.5 text-lg font-extrabold tracking-widest text-white">PISTA #{Math.min(game.index + 1, TOTAL_PRODUCTS)}</span>
                <span className="text-lg font-semibold text-on-surface-variant">de {TOTAL_PRODUCTS}</span>
              </div>
              <div key={game.index} className="pop flex flex-1 items-center justify-center gap-8">
                {product && running ? (
                  image ? (
                    <img src={image} data-product={product.id} alt="Producto a escanear" className="h-[21rem] w-auto max-w-full object-contain drop-shadow-xl portrait:h-[30rem]" />
                  ) : (
                    // Provisional: mientras no haya foto del producto se muestra icono y nombre
                    <>
                      <span className="flex h-40 w-40 items-center justify-center rounded-3xl bg-slate-50 text-gs1-blue ring-1 ring-slate-200"><Icon size={90} /></span>
                      <span className="font-display text-7xl font-extrabold leading-tight text-on-surface">{product.name}</span>
                    </>
                  )
                ) : game.phase === 'countdown' ? (
                  <span className="font-display text-6xl font-extrabold text-gs1-blue">¡Prepárate!</span>
                ) : (
                  <span className="font-display text-6xl font-extrabold text-gs1-blue">{game.phase === 'finished' ? '¡Terminaste!' : '¡Tiempo!'}</span>
                )}
              </div>

              <div className={`relative overflow-hidden rounded-2xl border-2 p-5 transition ${flash?.kind === 'bad' ? 'shake border-red-400 bg-red-50' : flash?.kind === 'ok' ? 'border-gs1-green bg-green-50' : 'border-slate-300 bg-slate-50'}`}>
                <div className="mb-2 flex items-center justify-between text-sm font-extrabold tracking-widest text-on-surface-variant">
                  <span className="flex items-center gap-2"><ScanLine size={18} /> ESCANEA EL CÓDIGO DE BARRAS</span>
                  <span className={running ? 'text-green-600' : ''}>{running ? '● PISTOLA ACTIVA' : 'INACTIVA'}</span>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); submit(code); }}>
                  <input
                    ref={inputRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 14))}
                    onBlur={() => running && setTimeout(focusInput, 0)}
                    disabled={!running}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={running ? 'El código aparece aquí al escanear…' : ''}
                    aria-label="Código de barras escaneado"
                    className="h-20 w-full rounded-xl border-2 border-slate-300 bg-white px-5 font-mono text-4xl tracking-widest outline-none focus:border-gs1-blue focus:ring-4 focus:ring-gs1-blue/15 disabled:opacity-50"
                  />
                </form>
                <div key={flash?.key} className={`pop mt-2 h-8 text-xl font-bold ${flash?.kind === 'bad' ? 'text-red-600' : 'text-green-700'}`}>{flash?.text ?? ''}</div>
              </div>
            </>
        </section>

        {/* Tique */}
        <section className="card-glow flex min-h-0 flex-col rounded-3xl bg-white p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Tique de carrera</h2>
            <span className="rounded-md bg-green-50 px-3 py-1 text-sm font-extrabold text-green-700 ring-1 ring-green-200">VALIDACIÓN GS1</span>
          </div>
          <ol className="mt-4 flex min-h-0 flex-1 flex-col justify-between gap-2">
            {Array.from({ length: TOTAL_PRODUCTS }, (_, i) => {
              const done = i < game.index;
              const current = i === game.index && running;
              const p = PRODUCTS[game.order[i]];
              return (
                <li key={i} className={`flex flex-1 items-center gap-4 rounded-xl border px-4 text-xl ${done ? 'border-green-200 bg-green-50' : current ? 'border-gs1-blue bg-blue-50' : 'border-dashed border-slate-300 text-slate-400'}`}>
                  {done ? <CircleCheck className="text-gs1-green" size={26} /> : <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${current ? 'border-gs1-blue text-gs1-blue' : 'border-slate-300'}`}>{i + 1}</span>}
                  {done && productImage(p.id) && <img src={productImage(p.id)} alt="" className="h-9 w-9 object-contain" />}
                  <span className={`flex-1 font-semibold ${done ? 'text-on-surface' : ''}`}>{done ? `${i + 1}. ${p.name}` : current ? 'EN CURSO' : 'Pista oculta'}</span>
                  {done && <span className="font-mono text-lg text-green-700">{formatClock(game.splits[i])}</span>}
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            {confirmCancel ? (
              <div className="flex w-full items-center gap-3">
                <span className="flex-1 text-lg font-semibold text-red-700">¿Cancelar el juego? Se borran equipos y resultados.</span>
                <button onClick={() => setConfirmCancel(false)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-lg font-semibold">No</button>
                <button onClick={onBack} className="rounded-xl bg-red-600 px-5 py-2.5 text-lg font-bold text-white">Sí, cancelar todo</button>
              </div>
            ) : (
              <>
                <span className="flex items-center gap-2 text-lg text-on-surface-variant"><TriangleAlert size={20} /> Faltas: {game.errors}</span>
                {!over && (
                  <button onClick={() => setConfirmCancel(true)} className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-lg font-semibold text-on-surface-variant hover:bg-slate-50"><X size={20} /> Cancelar partida</button>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {game.phase === 'countdown' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-gs1-blue to-[#0a3f8f]">
          <div className="flex flex-col items-center gap-10 px-16 text-center">
            <div className="text-2xl font-extrabold tracking-widest text-white/80">{team.name.toUpperCase()}, ¡PREPÁRATE!</div>
            <div key={count} className="pop font-display text-[18rem] font-extrabold leading-none text-white">{count}</div>
            <div className="flex max-w-3xl items-start gap-4 rounded-3xl bg-white/15 px-8 py-6 text-left text-3xl font-semibold leading-snug text-white">
              <Lightbulb size={44} className="mt-1 shrink-0 text-yellow-300" />
              <span><span className="block text-lg font-extrabold tracking-widest text-yellow-300">RECOMENDACIÓN</span>{tip}</span>
            </div>
          </div>
        </div>
      )}

      {over && <ResultOverlay game={game} team={team} data={data} nextTeam={nextTeam} onNext={onNext} onTiebreakQueue={onTiebreakQueue} onLeaderboard={onLeaderboard} />}
    </div>
  );
}

function ResultOverlay({ game, team, data, nextTeam, onNext, onTiebreakQueue, onLeaderboard }: { game: GameState; team: Team; data: AppData; nextTeam?: Team; onNext: () => void; onTiebreakQueue: () => void; onLeaderboard: () => void }) {
  const finished = game.phase === 'finished';
  const ranked = ranking(data.results);
  const position = ranked.findIndex((r) => r.teamId === team.id) + 1;
  const pending = nextTeam ? null : tiebreakPending(data.results);
  const pendingNames = pending ? pending.teamIds.map((id) => data.teams.find((t) => t.id === id)?.name ?? '').filter(Boolean) : [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gs1-blue/85 p-10">
      <div className="pop w-full max-w-[900px] rounded-3xl border-2 border-gs1-orange bg-white p-12 text-center shadow-2xl">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${finished ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-gs1-orange'}`}>{finished ? <Flag size={40} /> : <TriangleAlert size={40} />}</div>
        <h2 className="mt-4 font-display text-5xl font-extrabold text-gs1-blue">{finished ? '¡Carrera completada!' : '¡Se acabó el tiempo!'}</h2>
        <p className="mt-1 text-2xl text-on-surface-variant">{team.name}</p>
        <div className="mt-6 font-mono text-[8rem] font-extrabold leading-none tabular-nums text-on-surface">{formatClock(game.finalMs ?? 0)}</div>
        <div className="mt-6 flex justify-center gap-4 text-xl">
          <Pill label="PRODUCTOS" value={`${game.index} / ${TOTAL_PRODUCTS}`} />
          <Pill label="FALTAS" value={`${game.errors}${game.errors ? ` (+${game.penaltyMs / 1000} s)` : ''}`} />
          {position > 0 && <Pill label={nextTeam ? 'PUESTO ACTUAL' : 'PUESTO'} value={`${position}º de ${ranked.length}`} />}
        </div>
        {pending && (
          <div className="mt-6 rounded-2xl border-2 border-gs1-orange bg-orange-50 p-4 text-xl font-semibold text-gs1-orange">
            ¡Empate en el primer puesto! Desempate: {pendingNames.join(' y ')}. Se juega con un orden totalmente distinto.
          </div>
        )}
        <div className="mt-8">
          {nextTeam ? (
            <button onClick={onNext} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-5 font-display text-3xl font-extrabold text-white shadow-md shadow-gs1-orange/30 transition active:translate-y-0.5">
              Siguiente: {nextTeam.name} (Caja {nextTeam.box}) <ArrowRight size={32} />
            </button>
          ) : pending ? (
            <button onClick={onTiebreakQueue} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gs1-orange to-gs1-fuchsia py-5 font-display text-3xl font-extrabold text-white shadow-md shadow-gs1-orange/30 transition active:translate-y-0.5">
              Jugar desempate <ArrowRight size={32} />
            </button>
          ) : (
            <button onClick={onLeaderboard} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gs1-blue py-5 font-display text-3xl font-extrabold text-white transition active:translate-y-0.5">
              Ver tabla de posiciones <ArrowRight size={32} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-8 py-3">
      <div className="text-xs font-extrabold tracking-widest text-on-surface-variant">{label}</div>
      <div className="font-display text-3xl font-extrabold text-gs1-blue">{value}</div>
    </div>
  );
}
