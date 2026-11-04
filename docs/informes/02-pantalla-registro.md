# Informe 02: Pantalla 2 (Registro de Equipos)

Estado: **lista para revisión del usuario**. Captura: `02-registro.png` (referencia: `gs1_market_registro_de_equipo_tv_interactiva`).

## Qué se hizo (`src/screens/RegisterScreen.tsx`)
- Tres tarjetas, una por caja (1, 2, 3), cada una con interruptor Activa/Inactiva y estado (INACTIVA / INCOMPLETA / LISTA ✓).
- Por caja: nombre del equipo, jugador 1 (obligatorio) y jugador 2 (opcional, botón para añadir o quitar). Se guardan los nombres.
- Botón "Jugar con este equipo" (habilitado solo si el equipo está completo) que lleva al Desafío con ese equipo.
- **Autoguardado**: los equipos completos se guardan solos y se recuperan al volver o al recargar. Un equipo incompleto no se guarda.
- Validación: nombre de equipo repetido entre cajas se marca en rojo y bloquea el botón.
- Franja inferior con la canasta de 10 productos (nombre e icono, sin GTIN) y las reglas (orden sorteado, máx. 1:30, +5 s).
- Cabe en el lienzo 1920x1080 sin scroll.

## Cambios respecto a la maqueta
- Se quitaron: cadena comercial, cuenta regresiva de salida, estado del torneo, canasta de 8 SKU, 5 integrantes y roles, y la barra inferior de navegación (tapaba contenido).
- Se añadió "Volver al inicio".

## Verificación
- `tsc` sin errores y build correcto.
- Prueba automatizada en navegador (Playwright): activar cajas, escribir equipos de 1 y 2 jugadores, nombre repetido bloquea, guardado en `localStorage`, recarga conserva los datos, "Jugar" abre el Desafío con el equipo correcto. Sin errores de consola, scroll = 0.
- **No verificado**: en Electron (guardado en archivo JSON) ni con teclado táctil.

## Para revisar
- ¿Textos y orden de campos OK? ¿Quieres un límite distinto de caracteres (hoy 40)?
- Pendiente de decidir: ¿se pueden borrar los resultados de un equipo o se reinicia todo desde la Tabla? (se ve en la pantalla 4)
