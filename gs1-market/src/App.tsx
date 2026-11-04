import { useCallback, useState } from 'react';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { useAppData } from './hooks/useAppData';
import { HomeScreen } from './screens/HomeScreen';
import { ChallengeScreen } from './screens/ChallengeScreen';
import { Placeholder } from './screens/Placeholder';
import { RegisterScreen } from './screens/RegisterScreen';
import { tiebreakPending } from './lib/ranking';
import type { GameResult } from './lib/types';

type Screen = 'home' | 'register' | 'challenge' | 'leaderboard';

export function App() {
  const { data, loaded, update } = useAppData();
  const [screen, setScreen] = useState<Screen>('home');
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [tiebreak, setTiebreak] = useState<number | undefined>(undefined);
  const [gameKey, setGameKey] = useState(0);
  // Cola de juego: los equipos juegan uno tras otro sin volver al Registro
  const [queue, setQueue] = useState<string[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const home = () => setScreen('home');
  const onFinish = useCallback((result: GameResult) => update((d) => ({ ...d, results: [...d.results, result] })), [update]);
  const currentTeam = data.teams.find((t) => t.id === currentTeamId);
  const byBox = [...data.teams].sort((a, b) => a.box - b.box);

  const beginGame = (teamId: string) => {
    // Si hay un desempate pendiente y este equipo debe jugarlo, la partida es de desempate
    const pending = tiebreakPending(data.results);
    setCurrentTeamId(teamId);
    setTiebreak(pending?.teamIds.includes(teamId) ? pending.round : undefined);
    setGameKey((k) => k + 1);
    setScreen('challenge');
  };
  const startQueue = (ids: string[]) => {
    if (ids.length === 0) return;
    setQueue(ids);
    setQueueIndex(0);
    beginGame(ids[0]);
  };
  const startGame = () => {
    const pending = tiebreakPending(data.results);
    startQueue((pending ? byBox.filter((t) => pending.teamIds.includes(t.id)) : byBox).map((t) => t.id));
  };
  const nextTeam = data.teams.find((t) => t.id === queue[queueIndex + 1]);

  return (
    <>
      <Background />
      <Stage>
        <Header />
        {!loaded ? null : screen === 'home' ? (
          <HomeScreen data={data} onStart={() => setScreen('register')} onRecords={() => setScreen('leaderboard')} />
        ) : screen === 'register' ? (
          <RegisterScreen
          data={data}
          tiebreakTeamIds={tiebreakPending(data.results)?.teamIds ?? []}
          onSaveTeams={(teams) => update((d) => ({ ...d, teams }))}
          onStartGame={startGame}
          onBack={home}
        />
        ) : screen === 'challenge' ? (
  currentTeam ? (
          <ChallengeScreen
            key={gameKey}
            team={currentTeam}
            data={data}
            tiebreak={tiebreak}
            turn={{ current: queueIndex + 1, total: queue.length }}
            nextTeam={nextTeam}
            onFinish={onFinish}
            onBack={() => setScreen('register')}
            onNext={() => {
              setQueueIndex(queueIndex + 1);
              beginGame(queue[queueIndex + 1]);
            }}
            onTiebreakQueue={() => {
              const pending = tiebreakPending(data.results);
              startQueue(byBox.filter((t) => pending?.teamIds.includes(t.id)).map((t) => t.id));
            }}
            onLeaderboard={() => setScreen('leaderboard')}
          />
        ) : (
          <Placeholder title="Desafío en Vivo" onBack={() => setScreen('register')} />
        )
) : (
          <Placeholder title="Tabla de Posiciones" onBack={home} />
        )}
      </Stage>
    </>
  );
}
