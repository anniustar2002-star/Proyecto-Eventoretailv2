
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatTime } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  canStart: boolean;
  canPause: boolean;
  canReset: boolean;
}

export function TimerDisplay({ 
  elapsedTime, 
  isRunning, 
  onStart, 
  onPause, 
  onReset,
  canStart,
  canPause,
  canReset
}: TimerDisplayProps) {
  return (
    <Card className="text-center shadow-lg">
      <CardContent className="p-6">
        <div 
          className="text-5xl font-mono mb-6 text-primary"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(elapsedTime)}
        </div>
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <Button 
              onClick={onStart} 
              disabled={!canStart}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 text-lg transition-transform active:scale-95"
              aria-label="Iniciar temporizador"
            >
              <Play className="mr-2 h-5 w-5" /> Iniciar
            </Button>
          ) : (
            <Button 
              onClick={onPause} 
              disabled={!canPause}
              variant="secondary" 
              className="px-6 py-3 text-lg transition-transform active:scale-95"
              aria-label="Pausar temporizador"
            >
              <Pause className="mr-2 h-5 w-5" /> Pausar
            </Button>
          )}
          <Button 
            onClick={onReset} 
            variant="outline" 
            disabled={!canReset}
            className="px-6 py-3 text-lg border-secondary-foreground/50 text-secondary-foreground hover:bg-secondary-foreground/10 transition-transform active:scale-95"
            aria-label="Reiniciar temporizador"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
