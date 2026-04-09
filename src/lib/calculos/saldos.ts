import { convertirMonto } from "./conversion";
import { fijosVigentesEnMes } from "./fijos-del-mes";
import { montoVigenteEnMes } from "./monto-vigente";
import type { MovimientoFijo, HistoricoMonto } from "@/lib/types";

export type SaldosPorTipo = {
  liquido: { ars: number; usd: number };
  porCobrar: { ars: number; usd: number };
  comprometido: { ars: number; usd: number };
};

export function calcularSaldos(cotizacion: number): SaldosPorTipo {
  const saldos: SaldosPorTipo = {
    liquido: { ars: 0, usd: 0 },
    porCobrar: { ars: 0, usd: 0 },
    comprometido: { ars: 0, usd: 0 },
  };

  return saldos;
}

/**
 * Suma todos los fijos (ingresos menos egresos) que van a ocurrir
 * desde un mes dado hasta fin de año.
 *
 * Se calcula para cada mes individualmente porque los plazos y montos
 * pueden cambiar mes a mes.
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
  const mesActual = desdeMes.getMonth(); // 0-indexed

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

export function calcularDisponiblePorMes(
  saldos: SaldosPorTipo,
  proyeccionFijos: { ingresos: number; egresos: number },
  mesesRestantes: number,
  cotizacion: number,
): { ars: number; usd: number } {
  if (mesesRestantes <= 0) {
    return { ars: 0, usd: 0 };
  }

  const totalActualArs =
    saldos.liquido.ars + saldos.porCobrar.ars + saldos.comprometido.ars;

  const totalProyectadoArs =
    totalActualArs + proyeccionFijos.ingresos - proyeccionFijos.egresos;

  const arsPorMes = totalProyectadoArs / mesesRestantes;
  const usdPorMes = arsPorMes / cotizacion;

  return {
    ars: arsPorMes,
    usd: usdPorMes,
  };
}

export function mesesRestantesDelAño(fecha = new Date()): number {
  return 12 - fecha.getMonth();
}
