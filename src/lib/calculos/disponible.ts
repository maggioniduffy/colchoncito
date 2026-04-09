import { convertirMonto } from "./conversion";
import { fijosVigentesEnMes } from "./fijos-del-mes";
import { montoVigenteEnMes } from "./monto-vigente";
import type {
  PresupuestoAporte,
  MovimientoFijo,
  HistoricoMonto,
  MovimientoParticular,
} from "@/lib/types";

/**
 * Calcula el total del fondo del año a partir de los aportes.
 */
export function totalDelFondoAnual(
  aportes: PresupuestoAporte[],
  cotizacion: number,
): { ars: number; usd: number } {
  let totalArs = 0;
  let totalUsd = 0;

  for (const a of aportes) {
    const { ars, usd } = convertirMonto(Number(a.monto), a.moneda, cotizacion);
    totalArs += ars;
    totalUsd += usd;
  }

  return { ars: totalArs, usd: totalUsd };
}

/**
 * Proyecta ingresos y egresos fijos desde un mes hasta fin de año.
 * Igual que antes, pero se mantiene acá por claridad.
 */
export function proyectarFijosHastaFinDeAño(
  fijos: MovimientoFijo[],
  historicos: HistoricoMonto[],
  cotizacion: number,
  desdeMes: Date = new Date(),
): { ingresos: number; egresos: number } {
  let totalIngresosArs = 0;
  let totalEgresosArs = 0;

  const añoActual = desdeMes.getFullYear();
  const mesActual = desdeMes.getMonth();

  for (let m = mesActual; m < 12; m++) {
    const mesDB = `${añoActual}-${String(m + 1).padStart(2, "0")}-01`;
    const vigentes = fijosVigentesEnMes(fijos, mesDB);

    for (const fijo of vigentes) {
      const historicoFijo = historicos.filter(
        (h) => h.movimiento_fijo_id === fijo.id,
      );
      const montoReal = montoVigenteEnMes(
        mesDB,
        Number(fijo.monto),
        historicoFijo,
      );

      const { ars } = convertirMonto(
        montoReal,
        fijo.moneda_anclaje,
        cotizacion,
      );

      if (fijo.tipo === "ingreso") {
        totalIngresosArs += ars;
      } else {
        totalEgresosArs += ars;
      }
    }
  }

  return { ingresos: totalIngresosArs, egresos: totalEgresosArs };
}

/**
 * Suma los egresos particulares ya cargados en todos los meses del año.
 * Estos son "gastos ya hechos" que consumen del fondo.
 */
export function egresosParticularesDelAño(
  movimientos: MovimientoParticular[],
  cotizacion: number,
): number {
  let total = 0;
  for (const m of movimientos) {
    if (m.tipo !== "egreso") continue;
    const { ars } = convertirMonto(
      Number(m.monto),
      m.moneda_anclaje,
      cotizacion,
    );
    total += ars;
  }
  return total;
}

/**
 * Suma los ingresos particulares ya cargados en todos los meses del año.
 * Son "plata que entró de sorpresa" que se suma al fondo.
 */
export function ingresosParticularesDelAño(
  movimientos: MovimientoParticular[],
  cotizacion: number,
): number {
  let total = 0;
  for (const m of movimientos) {
    if (m.tipo !== "ingreso") continue;
    const { ars } = convertirMonto(
      Number(m.monto),
      m.moneda_anclaje,
      cotizacion,
    );
    total += ars;
  }
  return total;
}

/**
 * Cálculo del disponible por mes con el modelo nuevo.
 *
 * disponible_total = fondo_anual + ingresos_fijos_proyectados - egresos_fijos_proyectados
 *                  + ingresos_particulares_del_año - egresos_particulares_del_año
 *
 * disponible_por_mes = disponible_total / meses_restantes
 */
export function calcularDisponiblePorMes({
  fondoAnual,
  proyeccionFijos,
  ingresosParticulares,
  egresosParticulares,
  mesesRestantes,
  cotizacion,
}: {
  fondoAnual: { ars: number; usd: number };
  proyeccionFijos: { ingresos: number; egresos: number };
  ingresosParticulares: number;
  egresosParticulares: number;
  mesesRestantes: number;
  cotizacion: number;
}): { ars: number; usd: number; totalArs: number } {
  if (mesesRestantes <= 0) {
    return { ars: 0, usd: 0, totalArs: 0 };
  }

  const totalArs =
    fondoAnual.ars +
    proyeccionFijos.ingresos -
    proyeccionFijos.egresos +
    ingresosParticulares -
    egresosParticulares;

  const arsPorMes = totalArs / mesesRestantes;
  const usdPorMes = arsPorMes / cotizacion;

  return { ars: arsPorMes, usd: usdPorMes, totalArs };
}

export function mesesRestantesDelAño(fecha = new Date()): number {
  return 12 - fecha.getMonth();
}
