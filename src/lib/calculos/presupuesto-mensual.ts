import { convertirMonto } from "./conversion";
import type { PresupuestoAporte, MovimientoParticular } from "@/lib/types";

export function calcularBaseMensual(
  aportes: PresupuestoAporte[],
  mesesDivision: number,
  cotizacion: number,
): { ars: number; usd: number } {
  let totalArs = 0;
  for (const a of aportes) {
    const { ars } = convertirMonto(Number(a.monto), a.moneda, cotizacion);
    totalArs += ars;
  }
  const arsMes = mesesDivision > 0 ? totalArs / mesesDivision : 0;
  return { ars: arsMes, usd: arsMes / cotizacion };
}

/**
 * ¿Este mes está cubierto por el presupuesto?
 * mesNum: 1-12, desdeMes: 1-12, mesesDivision: 1-12
 */
export function mesEstaCubierto(
  mesNum: number,
  desdeMes: number,
  mesesDivision: number,
): boolean {
  const hastaMes = desdeMes + mesesDivision - 1;
  return mesNum >= desdeMes && mesNum <= hastaMes;
}

export function calcularRestanteDelMes(
  baseMensualArs: number,
  movimientosDelMes: MovimientoParticular[],
  cotizacion: number,
): { gastadoArs: number; ingresadoArs: number; restanteArs: number } {
  let gastado = 0;
  let ingresado = 0;
  for (const m of movimientosDelMes) {
    const { ars } = convertirMonto(
      Number(m.monto),
      m.moneda_anclaje,
      cotizacion,
    );
    if (m.tipo === "egreso") gastado += ars;
    else ingresado += ars;
  }
  return {
    gastadoArs: gastado,
    ingresadoArs: ingresado,
    restanteArs: baseMensualArs + ingresado - gastado,
  };
}
