
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
import { TOTAL_PRODUCTS_TO_SCAN } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface ScanAreaHandle {
  focusFirstInput: () => void;
}

interface ScanAreaProps {
  scannedItems: Set<number>;
  onScanItem: (itemId: number) => void;
  disabled: boolean;
}

export const ScanArea = React.forwardRef<ScanAreaHandle, ScanAreaProps>(
  ({ scannedItems, onScanItem, disabled }, ref) => {
    const products = Array.from({ length: TOTAL_PRODUCTS_TO_SCAN }, (_, i) => i);
    const [inputValues, setInputValues] = React.useState<string[]>(
      Array(TOTAL_PRODUCTS_TO_SCAN).fill('')
    );
    const { toast } = useToast();
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
      Array(TOTAL_PRODUCTS_TO_SCAN).fill(null)
    );

    React.useImperativeHandle(ref, () => ({
      focusFirstInput: () => {
        const firstUnscannedInput = inputRefs.current.find((inputRef, index) => !scannedItems.has(index) && inputRef);
        if (firstUnscannedInput) {
          firstUnscannedInput.focus();
        } else {
           inputRefs.current[0]?.focus();
        }
      }
    }));

    const handleInputChange = (index: number, value: string) => {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 14) {
        const newInputValues = [...inputValues];
        newInputValues[index] = numericValue;
        setInputValues(newInputValues);
      }
    };

    const handleSubmitBarcode = (itemIndex: number): boolean => {
      const enteredBarcode = inputValues[itemIndex];

      if (enteredBarcode.length === 0) {
        toast({
          variant: "destructive",
          title: "Código Vacío",
          description: "Por favor, ingresa un código de barras.",
        });
        return false;
      }

      // Allow any non-empty numeric string up to 14 digits
      if (enteredBarcode.match(/^[0-9]+$/) && enteredBarcode.length <= 14) {
        onScanItem(itemIndex);
        return true; // Indicates onScanItem was called
      } else {
        toast({
          variant: "destructive",
          title: "Código Inválido",
          description: `El código para Producto ${itemIndex + 1} debe ser numérico y de hasta 14 dígitos. Intenta de nuevo.`,
        });
        const newInputValues = [...inputValues];
        newInputValues[itemIndex] = ''; // Clear invalid input
        setInputValues(newInputValues);
        return false;
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, itemIndex: number) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        const isScanned = scannedItems.has(itemIndex);
        if (!disabled && !isScanned && inputValues[itemIndex].length > 0) {
          const submissionSuccessful = handleSubmitBarcode(itemIndex);

          if (submissionSuccessful) {
            // Try to focus the next available (unscanned) input field.
            // We need to check scannedItems *after* the current scan might have been processed.
            // So, we defer this slightly or find the next based on the *new* state.
            // For simplicity, let's find the next *unscanned* input based on current inputRefs and the assumption onScanItem will update scannedItems.
            setTimeout(() => { // Ensure state update from onScanItem has propagated
                let nextFocusIndex = -1;
                for (let i = 0; i < TOTAL_PRODUCTS_TO_SCAN; i++) {
                    // Find the first input that is NOT in the updated scannedItems set.
                    // Note: scannedItems in this closure might be stale.
                    // A more robust way would be to get the next focusable input *after* onScanItem has updated the parent's state.
                    // For now, we find the *next* input in sequence that hasn't been scanned yet.
                    if (!scannedItems.has(i) && i > itemIndex) { // Search from current item onwards
                        if (inputRefs.current[i]) {
                             nextFocusIndex = i;
                             break;
                        }
                    }
                }
                // If no next unscanned input is found after current, try from the beginning
                if(nextFocusIndex === -1){
                    for (let i = 0; i < itemIndex; i++) {
                         if (!scannedItems.has(i)) {
                            if (inputRefs.current[i]) {
                                nextFocusIndex = i;
                                break;
                            }
                        }
                    }
                }


                if (nextFocusIndex !== -1 && inputRefs.current[nextFocusIndex]) {
                  inputRefs.current[nextFocusIndex]?.focus();
                } else if (scannedItems.size < TOTAL_PRODUCTS_TO_SCAN -1 ) { // -1 because current item is now scanned
                    // If all items are scanned or no next input, focus might be lost or remain on last.
                    // This part can be enhanced based on desired UX after all items are scanned.
                }

            }, 0);
          }
          // If submissionSuccessful is false, an error toast was shown, so focus remains on the current input.
        }
      }
    };

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Área de Escaneo</CardTitle>
          <CardDescription>
            Ingresa el código de barras (hasta 14 dígitos) para cada uno de los {TOTAL_PRODUCTS_TO_SCAN} productos.
            {!disabled && scannedItems.size < TOTAL_PRODUCTS_TO_SCAN ? ' El temporizador está corriendo.' : ''}
            {disabled && scannedItems.size === 0 ? ' Inicia el temporizador para comenzar.' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((itemIndex) => {
              const isScanned = scannedItems.has(itemIndex);
              return (
                <div 
                  key={itemIndex} 
                  className={`p-4 border rounded-md transition-colors ${
                    isScanned 
                      ? 'bg-success-background border-success-border' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isScanned ? 'text-success-text-on-background dark:text-success-text-on-background' : 'text-foreground'}`}>
                      Producto {itemIndex + 1}
                    </span>
                    {isScanned && <CheckCircle2 className="h-6 w-6 text-success dark:text-success" />}
                  </div>
                  
                  {!isScanned && (
                    <div className="flex items-center space-x-2">
                      <Input
                        ref={(el) => { inputRefs.current[itemIndex] = el; }}
                        id={`barcode-input-${itemIndex}`}
                        type="text" 
                        value={inputValues[itemIndex]}
                        onChange={(e) => handleInputChange(itemIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, itemIndex)}
                        placeholder="Código (hasta 14 dígitos)"
                        maxLength={14}
                        pattern="\d{1,14}" 
                        disabled={disabled || isScanned}
                        className="flex-grow text-base"
                        aria-label={`Código de barras para Producto ${itemIndex + 1}`}
                      />
                      <Button
                        onClick={() => handleSubmitBarcode(itemIndex)}
                        disabled={disabled || isScanned || inputValues[itemIndex].length === 0}
                        variant="outline"
                        size="default"
                        className="px-4 py-2"
                      >
                        Verificar
                      </Button>
                    </div>
                  )}
                  {isScanned && (
                     <p className="text-sm text-success-text-on-background dark:text-success-text-on-background mt-1">Código verificado: {inputValues[itemIndex]}</p>
                  )}
                </div>
              );
            })}
          </div>
          {scannedItems.size === TOTAL_PRODUCTS_TO_SCAN && (
            <p className="mt-6 text-center text-lg font-semibold text-success dark:text-success animate-pulse-bg">
              ¡Todos los productos escaneados!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

ScanArea.displayName = "ScanArea";
