// Genera docs/codigos-de-barras/codigos-de-barras.html (imprimible) y .pdf con los EAN-13 de la canasta.
// Uso: node scripts/generar-codigos.mjs
import bwipjs from 'bwip-js';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, '..', 'docs', 'codigos-de-barras');
mkdirSync(out, { recursive: true });

// Se lee de src/data/products.ts para no duplicar los datos
const src = readFileSync(path.join(root, 'src/data/products.ts'), 'utf8');
const products = [...src.matchAll(/id: (\d+), name: '([^']+)', gtin: '(\d{13})'/g)].map((m) => ({ id: +m[1], name: m[2], gtin: m[3] }));
if (products.length === 0) throw new Error('No se encontraron productos');

const svg = (gtin) =>
  bwipjs.toSVG({ bcid: 'ean13', text: gtin.slice(0, 12), scale: 4, height: 18, includetext: true, textxalign: 'center', textsize: 11 });

const cards = products
  .map((p) => `<div class="card"><div class="n">${p.id}. ${p.name}</div>${svg(p.gtin)}</div>`)
  .join('\n');

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Códigos de barras - GS1 Market</title>
<style>
  @page { size: A4; margin: 12mm; }
  body { font-family: Arial, sans-serif; margin: 0; color: #000; }
  h1 { font-size: 16pt; margin: 0 0 4mm; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  .card { border: 1px dashed #888; padding: 5mm; text-align: center; break-inside: avoid; }
  .n { font-weight: bold; font-size: 13pt; margin-bottom: 3mm; }
  svg { width: 100%; height: auto; max-height: 38mm; }
  p { font-size: 9pt; color: #444; }
</style></head><body>
<h1>GS1 Market — Códigos de barras de la canasta (PRUEBA)</h1>
<p>Imprimir al 100 % (sin ajustar a la página). EAN-13 de prueba; recortar por la línea punteada.</p>
<div class="grid">${cards}</div></body></html>`;

writeFileSync(path.join(out, 'codigos-de-barras.html'), html);
console.log('HTML listo:', products.length, 'códigos');
