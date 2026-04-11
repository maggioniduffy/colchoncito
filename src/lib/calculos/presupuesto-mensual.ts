import { convertirMonto } from "./conversion";
import { fijosVigentesEnMes } from "./fijos-del-mes";
import { montoVigenteEnMes } from "./monto-vigente";
import type {
  PresupuestoAporte,
  MovimientoParticular,
  MovimientoFijo,
  HistoricoMonto,
} from "@/lib/types";

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
  mesDB: string,
  movimientosParticulares: MovimientoParticular[],
  fijos: MovimientoFijo[],
  historicos: HistoricoMonto[],
  cotizacion: number,
): { gastadoArs: number; ingresadoArs: number; restanteArs: number } {
  let gastado = 0;
  let ingresado = 0;

  // Particulares del mes
  for (const m of movimientosParticulares) {
    const { ars } = convertirMonto(
      Number(m.monto),
      m.moneda_anclaje,
      cotizacion,
    );
    if (m.tipo === "egreso") gastado += ars;
    else ingresado += ars;
  }

  // Fijos vigentes este mes
  const fijosVigentes = fijosVigentesEnMes(fijos, mesDB);
  for (const f of fijosVigentes) {
    const historicoFijo = historicos.filter(
      (h) => h.movimiento_fijo_id === f.id,
    );
    const monto = montoVigenteEnMes(mesDB, Number(f.monto), historicoFijo);
    const { ars } = convertirMonto(monto, f.moneda_anclaje, cotizacion);
    if (f.tipo === "egreso") gastado += ars;
    else ingresado += ars;
  }

  return {
    gastadoArs: gastado,
    ingresadoArs: ingresado,
    restanteArs: baseMensualArs + ingresado - gastado,
  };
}
