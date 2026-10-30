export interface ParticipantScore {
  id: string;
  name: string;
  time: number; // in milliseconds
}

export const TOTAL_PRODUCTS_TO_SCAN = 10;

// Barcodes for each product. Ensure there are TOTAL_PRODUCTS_TO_SCAN barcodes.
export const PRODUCT_BARCODES: string[] = [
  "12345", // Product 1
  "23456", // Product 2
  "34567", // Product 3
  "45678", // Product 4
  "56789", // Product 5
  "67890", // Product 6
  "78901", // Product 7
  "89012", // Product 8
  "90123", // Product 9
  "01234", // Product 10
];

if (PRODUCT_BARCODES.length !== TOTAL_PRODUCTS_TO_SCAN) {
  throw new Error(
    `PRODUCT_BARCODES array length (${PRODUCT_BARCODES.length}) does not match TOTAL_PRODUCTS_TO_SCAN (${TOTAL_PRODUCTS_TO_SCAN}). Please update src/lib/types.ts.`
  );
}
