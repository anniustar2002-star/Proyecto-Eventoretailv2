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
  const home = () => setScreen('home');
  const onFinish = useCallback((result: GameResult) => update((d) => ({ ...d, results: [...d.results, result] })), [update]);
  const currentTeam = data.teams.find((t) => t.id === currentTeamId);

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
          onPlay={(id) => {
            setCurrentTeamId(id);
            // Si hay un desempate pendiente y este equipo debe jugarlo, la partida es de desempate
            const pending = tiebreakPending(data.results);
            setTiebreak(pending?.teamIds.includes(id) ? pending.round : undefined);
            setGameKey((k) => k + 1);
            setScreen('challenge');
          }}
          onBack={home}
        />
        ) : screen === 'challenge' ? (
  currentTeam ? (
          <ChallengeScreen
            key={gameKey}
            team={currentTeam}
            data={data}
            tiebreak={tiebreak}
            onFinish={onFinish}
            onBack={() => setScreen('register')}
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
