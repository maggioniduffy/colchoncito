import { convertirMonto } from "./conversion";
import { fijosVigentesEnMes } from "./fijos-del-mes";
import { montoVigenteEnMes } from "./monto-vigente";
import { calcularBaseMensual, mesEstaCubierto } from "./presupuesto-mensual";
import type {
  PresupuestoAporte,
  PresupuestoConfigAnual,
  MovimientoParticular,
  MovimientoFijo,
  HistoricoMonto,
} from "@/lib/types";

export function calcularSobranteMes(
  mesDB: string,
  aportes: PresupuestoAporte[],
  config: PresupuestoConfigAnual,
  movimientos: MovimientoParticular[],
  fijos: MovimientoFijo[],
  historicos: HistoricoMonto[],
  cotizacion: number,
): number {
  const mesNum = parseInt(mesDB.slice(5, 7));

  if (!mesEstaCubierto(mesNum, config.desde_mes, config.meses_division)) {
    return 0;
  }

  const base = calcularBaseMensual(aportes, config.meses_division, cotizacion);
  let gastado = 0;
  let ingresado = 0;

  // Particulares
  for (const m of movimientos) {
    const { ars } = convertirMonto(
      Number(m.monto),
      m.moneda_anclaje,
      cotizacion,
    );
    if (m.tipo === "egreso") gastado += ars;
    else ingresado += ars;
  }

  // Fijos vigentes
  const vigentes = fijosVigentesEnMes(fijos, mesDB);
  for (const f of vigentes) {
    const hist = historicos.filter((h) => h.movimiento_fijo_id === f.id);
    const monto = montoVigenteEnMes(mesDB, Number(f.monto), hist);
    const { ars } = convertirMonto(monto, f.moneda_anclaje, cotizacion);
    if (f.tipo === "egreso") gastado += ars;
    else ingresado += ars;
  }

  return base.ars + ingresado - gastado;
}

/**
 * Devuelve el mesDB del mes anterior al actual.
 */
export function getMesAnteriorDB(): string {
  const now = new Date();
  const anterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return anterior.toLocaleDateString("en-CA").slice(0, 7) + "-01";
}

/**
 * ¿Estamos en los primeros N días del mes? (ventana para mostrar el modal)
 */
export function estamosEnVentanaDeCierre(diasVentana = 7): boolean {
  return new Date().getDate() <= diasVentana;
}
