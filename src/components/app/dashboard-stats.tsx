"use client";

import { useCotizacionStore } from "@/stores/cotizacion-store";
import { calcularBaseMensual } from "@/lib/calculos/presupuesto-mensual";
import {
  totalDelFondoAnual,
  proyectarFijosHastaFinDeAño,
} from "@/lib/calculos/disponible";
import { formatARS, formatUSD } from "@/lib/format";
import DesktopCotizaciones from "./desktop-cotizaciones";
import type {
  PresupuestoAporte,
  PresupuestoConfigAnual,
  MovimientoFijo,
  HistoricoMonto,
} from "@/lib/types";

export default function DashboardStats({
  aportes,
  fijos,
  historicos,
  config,
}: {
  aportes: PresupuestoAporte[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
  config: PresupuestoConfigAnual;
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const fondoAnual = totalDelFondoAnual(aportes, cotizacion);
  const baseMensual = calcularBaseMensual(
    aportes,
    config.meses_division,
    cotizacion,
  );
  const proyeccion = proyectarFijosHastaFinDeAño(fijos, historicos, cotizacion);

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <section className="mx-5 mb-5 rounded-xl bg-primary/10 p-4 md:col-span-2 md:mx-0 md:p-6">
          <p className="mb-1 text-[11px] font-medium text-primary">
            PRESUPUESTO MENSUAL
          </p>
          <p className="text-[28px] font-medium leading-tight text-primary md:text-5xl">
            {formatARS(baseMensual.ars)}
          </p>
          <p className="mt-0.5 text-xs text-primary/70 md:mt-2 md:text-sm">
            {formatUSD(baseMensual.usd)} · {config.meses_division} meses
          </p>
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
