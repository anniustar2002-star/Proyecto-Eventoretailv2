# GS1 Market — La Carrera de Escaneo

Aplicación de escritorio (Windows) para un juego de velocidad con pistolas lectoras de códigos de barras GS1, pensada para proyectarse en una TV. Funciona **sin internet**.

- Código: `gs1-market/` (Electron + React + TypeScript + Vite + Tailwind).
- Plan, decisiones e informes por pantalla: `docs/` (empieza por `docs/informes/05-informe-final.md`).
- Maquetas de diseño de partida: `Carrera-de-escaneo-imagenes/`.

## Desarrollo
```bash
cd gs1-market
npm install
npm run dev          # navegador (http://localhost:5173)
npm test             # pruebas de la lógica del juego
npm run electron:dev # compila y abre en Electron
```

## Compilar para Windows
- **Instalador + versión portátil**: pestaña *Actions* de GitHub > *Compilar GS1 Market para Windows* > *Run workflow*; el resultado se descarga como artefacto `GS1-Market-Windows`.
- **Solo versión portátil (zip)**, desde Linux/Mac/Windows: `npm run electron:zip` (sale en `gs1-market/release/`).

## Códigos de barras de prueba
`docs/codigos-de-barras/codigos-de-barras.pdf` (10 EAN-13). Los GTIN están en `gs1-market/src/data/products.ts`.
