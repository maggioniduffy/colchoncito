import type { Moneda } from "@/lib/types";

/**
 * Dado un monto en su moneda de anclaje, devuelve los dos valores
 * (ARS y USD) usando la cotización actual.
 */
export function convertirMonto(
  monto: number,
  monedaAnclaje: Moneda,
  cotizacion: number,
): { ars: number; usd: number } {
  if (monedaAnclaje === "USD") {
    return { ars: monto * cotizacion, usd: monto };
  }
  return { ars: monto, usd: monto / cotizacion };
}
