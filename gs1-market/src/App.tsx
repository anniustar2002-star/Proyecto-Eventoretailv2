import { useState } from 'react';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { useAppData } from './hooks/useAppData';
import { HomeScreen } from './screens/HomeScreen';
import { Placeholder } from './screens/Placeholder';
import { RegisterScreen } from './screens/RegisterScreen';

type Screen = 'home' | 'register' | 'challenge' | 'leaderboard';

export function App() {
  const { data, loaded, update } = useAppData();
  const [screen, setScreen] = useState<Screen>('home');
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const home = () => setScreen('home');
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
          onSaveTeams={(teams) => update((d) => ({ ...d, teams }))}
          onPlay={(id) => {
            setCurrentTeamId(id);
            setScreen('challenge');
          }}
          onBack={home}
        />
        ) : screen === 'challenge' ? (
          <Placeholder title="Desafío en Vivo" subtitle={currentTeam ? currentTeam.players.length === 1 && currentTeam.players[0] === currentTeam.name ? `Participante: ${currentTeam.name}` : `Equipo: ${currentTeam.name} (${currentTeam.players.join(' y ')})` : undefined} onBack={home} />
        ) : (
          <Placeholder title="Tabla de Posiciones" onBack={home} />
        )}
      </Stage>
    </>
  );
}
