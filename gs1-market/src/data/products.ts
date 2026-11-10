// ÚNICO lugar donde viven los productos. GTIN de PRUEBA (prefijo 759999, dígito verificador válido).
// Reemplazar por los reales cuando estén disponibles. Ver docs/datos-productos.md.
export interface Product {
  id: number;
  name: string;
  gtin: string;
}

export const PRODUCTS: readonly Product[] = [
  { id: 1, name: 'Leche', gtin: '7599990011170' },
  { id: 2, name: 'Mantequilla', gtin: '7599990022343' },
  { id: 3, name: 'Pasta', gtin: '7599990033516' },
  { id: 4, name: 'Cereal', gtin: '7599990044680' },
  { id: 5, name: 'Aceite', gtin: '7599990055853' },
  { id: 6, name: 'Lata de Maíz', gtin: '7599990067023' },
  { id: 7, name: 'Jarabe para la tos', gtin: '7599990078197' },
  { id: 8, name: 'Jabón Facial', gtin: '7599990089360' },
  { id: 9, name: 'Caja de Acetaminofén', gtin: '7599990100539' },
  { id: 10, name: 'Barra de Chocolate', gtin: '7599990111702' },
];

export const TOTAL_PRODUCTS = PRODUCTS.length;
