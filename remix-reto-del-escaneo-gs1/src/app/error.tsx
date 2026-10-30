
"use client";

import type { ErrorPageProps } from 'next/dist/shared/lib/utils';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Gs1Logo } from '@/components/icons/gs1-logo';

export default function GlobalError({ error, reset }: ErrorPageProps & { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8 font-sans">
      <header className="w-full max-w-xl mb-6 sm:mb-10 flex flex-col items-center justify-center gap-4">
        <Gs1Logo className="text-primary h-12 sm:h-16 w-auto" />
        <h1 className="text-xl sm:text-3xl font-bold text-primary text-center">
          El reto del escaneo GS1
        </h1>
      </header>
      <main className="w-full max-w-xl">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-destructive mt-4">¡Ups! Algo salió mal</CardTitle>
            <CardDescription>
              Parece que hemos encontrado un error inesperado.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Puedes intentar recargar la página o volver a la página anterior.
            </p>
            {error?.message && (
                <details className="mt-4 p-2 bg-muted/50 border rounded-md text-xs text-left">
                    <summary className="cursor-pointer font-medium text-muted-foreground">Detalles del error</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-all">
                        {error.message}
                        {error.digest && `\nDigest: ${error.digest}`}
                    </pre>
                </details>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => reset()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Volver a intentar"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Volver a intentar
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              aria-label="Volver a la página anterior"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la página anterior
            </Button>
          </CardFooter>
        </Card>
      </main>
       <footer className="w-full max-w-3xl mt-10 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} GS1 Challenge. Creado con IA.</p>
        <p>Este es un proyecto de demostración.</p>
      </footer>
    </div>
  );
}
