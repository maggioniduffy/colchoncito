"use client";

import { useCotizacionStore } from "@/stores/cotizacion-store";
import {
  totalDelFondoAnual,
  proyectarFijosHastaFinDeAño,
  egresosParticularesDelAño,
  ingresosParticularesDelAño,
  calcularDisponiblePorMes,
  mesesRestantesDelAño,
} from "@/lib/calculos/disponible";
import { formatARS, formatUSD } from "@/lib/format";
import DesktopCotizaciones from "./desktop-cotizaciones";
import type {
  PresupuestoAporte,
  MovimientoFijo,
  HistoricoMonto,
  MovimientoParticular,
} from "@/lib/types";

export default function DashboardStats({
  aportes,
  fijos,
  historicos,
  movimientosDelAño,
}: {
  aportes: PresupuestoAporte[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
  movimientosDelAño: MovimientoParticular[];
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const fondoAnual = totalDelFondoAnual(aportes, cotizacion);
  const proyeccion = proyectarFijosHastaFinDeAño(fijos, historicos, cotizacion);
  const egresosPart = egresosParticularesDelAño(movimientosDelAño, cotizacion);
  const ingresosPart = ingresosParticularesDelAño(
    movimientosDelAño,
    cotizacion,
  );
  const mesesRestantes = mesesRestantesDelAño();

  const disponible = calcularDisponiblePorMes({
    fondoAnual,
    proyeccionFijos: proyeccion,
    ingresosParticulares: ingresosPart,
    egresosParticulares: egresosPart,
    mesesRestantes,
    cotizacion,
  });

  const sinDatos = aportes.length === 0 && fijos.length === 0;

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <section className="mx-5 mb-5 rounded-xl bg-primary/10 p-4 md:col-span-2 md:mx-0 md:p-6">
          <p className="mb-1 text-[11px] font-medium text-primary">
            DISPONIBLE POR MES · hasta diciembre
          </p>
          <p className="text-[28px] font-medium leading-tight text-primary md:text-5xl">
            {formatARS(disponible.ars)}
          </p>
          <p className="mt-0.5 text-xs text-primary/70 md:mt-2 md:text-sm">
            {formatUSD(disponible.usd)} · {mesesRestantes}{" "}
            {mesesRestantes === 1 ? "mes restante" : "meses restantes"}
          </p>

          {!sinDatos && (
            <div className="mt-3 border-t border-primary/20 pt-2 text-[11px] text-primary/80">
              <div className="flex justify-between">
                <span className="opacity-70">
                  Total proyectado hasta fin de año:
                </span>
                <span className="font-medium">
                  {formatARS(disponible.totalArs)}
                </span>
              </div>
            </div>
          )}
        </section>

        <div className="hidden md:flex md:flex-col md:gap-3">
          <DesktopCotizaciones />
        </div>
      </div>

      <div className="mx-5 mb-4 grid grid-cols-2 gap-2.5 md:mx-0 md:mt-6 md:grid-cols-3 md:gap-4">
        <div className="rounded-lg bg-muted p-3 md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            FONDO ANUAL
          </div>
          <div className="mt-0.5 text-base font-medium md:text-xl">
            {formatARS(fondoAnual.ars)}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            {formatUSD(fondoAnual.usd)}
          </div>
        </div>
        <div className="rounded-lg bg-muted p-3 md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            INGRESOS FIJOS
          </div>
          <div className="mt-0.5 text-base font-medium text-emerald-600 dark:text-emerald-400 md:text-xl">
            {formatARS(proyeccion.ingresos)}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            proyectados
          </div>
        </div>
        <div className="hidden rounded-lg bg-muted p-3 md:block md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            EGRESOS FIJOS
          </div>
          <div className="mt-0.5 text-base font-medium text-destructive md:text-xl">
            {formatARS(proyeccion.egresos)}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            proyectados
          </div>
        </div>
      </div>
    </>
  );
}
