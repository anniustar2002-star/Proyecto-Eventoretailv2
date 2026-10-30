
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { ParticipantForm } from '@/components/game/participant-form';
import { TimerDisplay } from '@/components/game/timer-display';
import { ScanArea, type ScanAreaHandle } from '@/components/game/scan-area';
import { LeaderboardTable } from '@/components/game/leaderboard-table';
import { Gs1Logo } from '@/components/icons/gs1-logo';
import type { ParticipantScore } from '@/lib/types';
import { TOTAL_PRODUCTS_TO_SCAN } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogPrimitiveTitle, // Renamed to avoid conflict
} from "@/components/ui/alert-dialog"

type GameView = 'register' | 'playing' | 'paused' | 'results';

interface GameState {
  view: GameView;
  participantName: string;
  startTime: number | null;
  elapsedTime: number;
  scannedItems: Set<number>;
  leaderboard: ParticipantScore[];
  currentScoreId: string | null;
}

const initialGameState: GameState = {
  view: 'register',
  participantName: '',
  startTime: null,
  elapsedTime: 0,
  scannedItems: new Set(),
  leaderboard: [],
  currentScoreId: null,
};

const Home: FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState<string>('');
  const scanAreaRef = useRef<ScanAreaHandle>(null);
  const [isResetLeaderboardAlertOpen, setIsResetLeaderboardAlertOpen] = useState(false);


  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear().toString());
    // Load leaderboard from localStorage if available
    const storedLeaderboard = localStorage.getItem('gs1Leaderboard');
    if (storedLeaderboard) {
      try {
        const parsedLeaderboard = JSON.parse(storedLeaderboard);
        if (Array.isArray(parsedLeaderboard)) {
            setGameState(prev => ({ ...prev, leaderboard: parsedLeaderboard }));
        } else {
            localStorage.removeItem('gs1Leaderboard'); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse leaderboard from localStorage", error);
        localStorage.removeItem('gs1Leaderboard'); // Clear corrupted data
      }
    }
  }, []);
  
  useEffect(() => {
    // Save leaderboard to localStorage when it changes
    if (isClient) {
      localStorage.setItem('gs1Leaderboard', JSON.stringify(gameState.leaderboard));
    }
  }, [gameState.leaderboard, isClient]);

  const resetGameForNewParticipant = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      view: 'playing',
      participantName: name,
      startTime: null, // Timer doesn't start immediately
      elapsedTime: 0,
      scannedItems: new Set(),
      currentScoreId: null,
    }));
    // Toast is removed as instructions will be shown
  }, []);

  const handleStartChallenge = (name: string) => {
    resetGameForNewParticipant(name);
  };

  const handleStartTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      view: 'playing', // Ensure view is playing
      startTime: Date.now() - prev.elapsedTime, // Adjust if resuming from pause
      scannedItems: prev.elapsedTime === 0 ? new Set() : prev.scannedItems, // Reset scans only if it's a fresh start
    }));
    // Delay focus slightly to ensure input is visible and ready
    setTimeout(() => {
        scanAreaRef.current?.focusFirstInput();
    }, 100);
  }, []);

  const handlePauseTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      view: 'paused',
      // elapsed time is already being tracked by the interval
    }));
  }, []);

  const handleResetTimerAndScans = useCallback(() => {
    if (confirm("¿Estás seguro de que quieres reiniciar el temporizador y los escaneos? Perderás el progreso actual.")) {
      setGameState(prev => ({
        ...prev,
        view: 'playing', // Go back to playing view, timer not running
        startTime: null,
        elapsedTime: 0,
        scannedItems: new Set(),
      }));
      toast({ title: "Temporizador Reiniciado", description: "Puedes comenzar de nuevo."});
      scanAreaRef.current?.focusFirstInput(); // Focus first input after reset
    }
  }, [toast]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (gameState.view === 'playing' && gameState.startTime !== null) {
      intervalId = setInterval(() => {
        setGameState(prev => {
          if (prev.view !== 'playing' || prev.startTime === null) {
            clearInterval(intervalId);
            return prev;
          }
          return {
            ...prev,
            elapsedTime: Date.now() - prev.startTime,
          };
        });
      }, 50); // Update roughly every 50ms
    }
    return () => clearInterval(intervalId);
  }, [gameState.view, gameState.startTime]);

  const handleScanItem = useCallback((itemId: number) => {
    if (gameState.view !== 'playing' || gameState.startTime === null) return;

    setGameState(prev => {
      const newScannedItems = new Set(prev.scannedItems);
      newScannedItems.add(itemId);

      const currentElapsedTime = Date.now() - prev.startTime!;

      if (newScannedItems.size === TOTAL_PRODUCTS_TO_SCAN) {
        const newScore: ParticipantScore = {
          id: Date.now().toString(),
          name: prev.participantName,
          time: currentElapsedTime,
        };
        const updatedLeaderboard = [...prev.leaderboard, newScore]
          .sort((a, b) => a.time - b.time)
          .slice(0, 10); // Keep top 10

        toast({
          title: "¡Desafío Completado!",
          description: `Tu tiempo: ${currentElapsedTime / 1000}s. ¡Bien hecho, ${prev.participantName}!`,
          duration: 5000,
        });
        
        return {
          ...prev,
          view: 'results',
          elapsedTime: currentElapsedTime,
          scannedItems: newScannedItems,
          leaderboard: updatedLeaderboard,
          currentScoreId: newScore.id,
        };
      }
      
      toast({ title: "¡Producto Escaneado!", description: `Producto ${itemId + 1} registrado.` });
      return {
        ...prev,
        scannedItems: newScannedItems,
        elapsedTime: currentElapsedTime, // Ensure elapsedTime is updated on each scan
      };
    });
  }, [toast, gameState.view, gameState.startTime, gameState.participantName, gameState.leaderboard ]);

  const handlePlayAgain = () => {
    setGameState(prev => ({
      ...initialGameState,
      leaderboard: prev.leaderboard, // Keep leaderboard
      view: 'register',
    }));
  };
  
  const handleExitToRegister = () => {
     if (gameState.startTime !== null && gameState.scannedItems.size < TOTAL_PRODUCTS_TO_SCAN && gameState.scannedItems.size > 0) {
        if (!confirm("¿Estás seguro de que quieres salir? Perderás el progreso actual.")) {
            return;
        }
     }
    setGameState(prev => ({
      ...initialGameState,
      leaderboard: prev.leaderboard,
      view: 'register',
    }));
  };

  const handleResetLeaderboard = useCallback(() => {
    setIsResetLeaderboardAlertOpen(true);
  }, []);

  const confirmResetLeaderboard = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      leaderboard: [],
      currentScoreId: null, // Clear current score highlight if any
    }));
    if (isClient) {
      localStorage.removeItem('gs1Leaderboard');
    }
    toast({
      title: "Tabla de Posiciones Reiniciada",
      description: "Todos los puntajes han sido borrados.",
    });
    setIsResetLeaderboardAlertOpen(false);
  }, [toast, isClient]);


  if (!isClient) {
    // Render nothing or a loading indicator SSR/prerender to avoid hydration mismatch for localStorage
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <Gs1Logo className="text-primary h-16 w-auto mb-4" />
        <p>Cargando desafío...</p>
      </div>
    );
  }

  const isTimerEffectivelyRunning = gameState.view === 'playing' && gameState.startTime !== null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8 font-sans">
      <header className="w-full max-w-3xl mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left"> 
          
          <h1 className="text-xl sm:text-3xl font-bold text-primary whitespace-nowrap mt-2">
            El reto del escaneo GS1
          </h1>
        </div>
        
        {(gameState.view === 'playing' || gameState.view === 'paused' || gameState.view === 'results') && gameState.view !== 'register' && (
          <Button variant="outline" onClick={handleExitToRegister} size="sm" className="text-sm">
            <LogOut className="mr-2 h-4 w-4" /> Salir
          </Button>
        )}
      </header>

      <main className="w-full max-w-3xl space-y-8">
        {gameState.view === 'register' && (
          <ParticipantForm onStartChallenge={handleStartChallenge} />
        )}

        {(gameState.view === 'playing' || gameState.view === 'paused') && (
          <>
            <div className="text-center mb-4">
              <p className="text-xl text-secondary-foreground">Participante: <span className="font-semibold text-primary">{gameState.participantName}</span></p>
            </div>

            {gameState.view === 'playing' && gameState.startTime === null && (
              <Card className="bg-primary/5 border-primary shadow-lg animate-pulse-bg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-primary">
                    <Info className="mr-2 h-6 w-6" />
                    ¡Atención, {gameState.participantName}!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary">
                    Escáner en mano y prepárate para ser el más rápido en escanear.
                  </p>
                  <p className="text-sm text-primary/80 mt-2">
                    Haz clic en "Iniciar" cuando estés listo. ¡Mucha suerte!
                  </p>
                </CardContent>
              </Card>
            )}
            
            <TimerDisplay
              elapsedTime={gameState.elapsedTime}
              isRunning={isTimerEffectivelyRunning}
              onStart={handleStartTimer}
              onPause={handlePauseTimer}
              onReset={handleResetTimerAndScans}
              canStart={gameState.startTime === null || gameState.view === 'paused'}
              canPause={isTimerEffectivelyRunning}
              canReset={gameState.elapsedTime > 0 || gameState.scannedItems.size > 0}
            />
            <ScanArea
              ref={scanAreaRef}
              scannedItems={gameState.scannedItems}
              onScanItem={handleScanItem}
              disabled={!isTimerEffectivelyRunning || gameState.scannedItems.size === TOTAL_PRODUCTS_TO_SCAN}
            />
          </>
        )}

        {gameState.view === 'results' && (
          <>
          <LeaderboardTable 
            scores={gameState.leaderboard} 
            onPlayAgain={handlePlayAgain}
            onResetLeaderboard={handleResetLeaderboard}
            currentParticipantId={gameState.currentScoreId ?? undefined}
            hasScores={gameState.leaderboard.length > 0}
          />
           <AlertDialog open={isResetLeaderboardAlertOpen} onOpenChange={setIsResetLeaderboardAlertOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogPrimitiveTitle>¿Estás seguro?</AlertDialogPrimitiveTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se borrarán permanentemente todas las puntuaciones de la tabla de posiciones.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsResetLeaderboardAlertOpen(false)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmResetLeaderboard} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Sí, borrar todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </main>

      <footer className="w-full max-w-3xl mt-10 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground">
        <p>&copy; {currentYear || new Date().getFullYear()} GS1 Challenge. Creado con IA.</p>
        <p>Este es un proyecto de demostración.</p>
      </footer>
    </div>
  );
}

export default Home;

    


