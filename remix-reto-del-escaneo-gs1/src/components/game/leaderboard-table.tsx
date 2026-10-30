
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ParticipantScore } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { Award, RefreshCw, Trophy, Medal, Star, Trash2 } from 'lucide-react';


interface LeaderboardTableProps {
  scores: ParticipantScore[];
  onPlayAgain: () => void;
  onResetLeaderboard: () => void;
  currentParticipantId?: string;
  hasScores: boolean;
}

export function LeaderboardTable({ scores, onPlayAgain, onResetLeaderboard, currentParticipantId, hasScores }: LeaderboardTableProps) {
  const sortedScores = [...scores].sort((a, b) => a.time - b.time);

  const getTrophyIcon = (index: number) => {
    if (index === 0) {
      return <Trophy className="h-5 w-5 text-yellow-500" aria-label="Gold Trophy" />;
    }
    if (index === 1) {
      return <Medal className="h-5 w-5 text-slate-400" aria-label="Silver Medal" />;
    }
    if (index === 2) {
      return <Star className="h-5 w-5 text-orange-400" aria-label="Bronze Star" />; // Using Star as a bronze equivalent
    }
    return null;
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Award className="h-6 w-6" />
          Tabla de Posiciones
        </CardTitle>
        <CardDescription>Los mejores tiempos del desafío de escaneo.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedScores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aún no hay puntuaciones. ¡Sé el primero!</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px] text-center text-secondary-foreground">#</TableHead>
                  <TableHead className="text-secondary-foreground">Nombre</TableHead>
                  <TableHead className="text-right text-secondary-foreground">Tiempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedScores.map((score, index) => (
                  <TableRow 
                    key={score.id} 
                    className={`transition-colors ${score.id === currentParticipantId ? 'bg-accent/20 animate-pulse-bg' : 'hover:bg-muted/30'}`}
                  >
                    <TableCell className="font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getTrophyIcon(index)}
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{score.name}</TableCell>
                    <TableCell className="text-right font-mono">{formatTime(score.time)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        <Button 
          onClick={onPlayAgain} 
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 px-8 transition-transform active:scale-95"
          aria-label="Jugar de nuevo"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Jugar de Nuevo
        </Button>
        {hasScores && (
           <Button 
            onClick={onResetLeaderboard} 
            variant="destructive"
            className="text-sm py-2 px-4 transition-transform active:scale-95"
            aria-label="Reiniciar tabla de posiciones"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Reiniciar Tabla
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

