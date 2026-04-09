import type { HistoricoMonto } from "@/lib/types";

/**
 * Devuelve el monto vigente para un mes dado, buscando en el histórico.
 * El histórico se asume ordenado por desde_mes descendente (más reciente primero).
 *
 * Si el mes consultado es anterior al registro más viejo del histórico,
 * usa el monto base del movimiento.
 */
export function montoVigenteEnMes(
  mesDB: string,
  montoBase: number,
  historico: HistoricoMonto[],
): number {
  // Buscar el registro más reciente cuya fecha sea <= al mes consultado
  const aplicable = historico
    .filter((h) => h.desde_mes <= mesDB)
    .sort((a, b) => b.desde_mes.localeCompare(a.desde_mes))[0];

  return aplicable ? Number(aplicable.monto) : montoBase;
}
