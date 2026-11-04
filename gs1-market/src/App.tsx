import { useState } from 'react';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { useAppData } from './hooks/useAppData';
import { HomeScreen } from './screens/HomeScreen';
import { Placeholder } from './screens/Placeholder';

type Screen = 'home' | 'register' | 'challenge' | 'leaderboard';

export function App() {
  const { data, loaded } = useAppData();
  const [screen, setScreen] = useState<Screen>('home');
  const home = () => setScreen('home');

  return (
    <>
      <Background />
      <Stage>
        <Header />
        {!loaded ? null : screen === 'home' ? (
          <HomeScreen data={data} onStart={() => setScreen('register')} onRecords={() => setScreen('leaderboard')} />
        ) : screen === 'register' ? (
          <Placeholder title="Registro de Escuadrón" onBack={home} />
        ) : screen === 'challenge' ? (
          <Placeholder title="Desafío en Vivo" onBack={home} />
        ) : (
          <Placeholder title="Tabla de Posiciones" onBack={home} />
        )}
      </Stage>
    </>
  );
}
