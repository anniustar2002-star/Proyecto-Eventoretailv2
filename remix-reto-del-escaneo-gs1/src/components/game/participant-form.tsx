
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface ParticipantFormProps {
  onStartChallenge: (name: string) => void;
}

export function ParticipantForm({ onStartChallenge }: ParticipantFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStartChallenge(name.trim());
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="h-6 w-6" />
          Registro de Participante
        </CardTitle>
        <CardDescription>Ingresa tu nombre para comenzar el desafío.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="participantName" className="text-secondary-foreground">Nombre del Participante</Label>
            <Input
              id="participantName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 transition-transform active:scale-95">
            Comenzar Desafío
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
