// Las imágenes se toman de src/assets/products/ y se emparejan por el número al inicio del archivo (1.png, 02-leche.webp...)
const files = import.meta.glob('../assets/products/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const byId = new Map<number, string>();
for (const [path, url] of Object.entries(files)) {
  const match = /\/(\d+)[^/]*\.\w+$/.exec(path);
  if (match) byId.set(Number(match[1]), url);
}

/** URL de la imagen del producto, o undefined si aún no se ha añadido. */
export const productImage = (id: number): string | undefined => byId.get(id);
