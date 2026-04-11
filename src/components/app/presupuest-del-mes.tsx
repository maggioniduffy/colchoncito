"use client";

import { useCotizacionStore } from "@/stores/cotizacion-store";
import {
  calcularBaseMensual,
  calcularRestanteDelMes,
  mesEstaCubierto,
} from "@/lib/calculos/presupuesto-mensual";
import { formatARS } from "@/lib/format";
import type {
  PresupuestoAporte,
  PresupuestoConfigAnual,
  MovimientoParticular,
  HistoricoMonto,
  MovimientoFijo,
} from "@/lib/types";

export default function PresupuestoDelMes({
  mesDB,
  aportes,
  config,
  movimientos,
  fijos,
  historicos,
}: {
  mesDB: string;
  aportes: PresupuestoAporte[];
  config: PresupuestoConfigAnual;
  movimientos: MovimientoParticular[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());
  const mesNum = parseInt(mesDB.slice(5, 7));

  const cubierto = mesEstaCubierto(
    mesNum,
    config.desde_mes,
    config.meses_division,
  );
  if (!cubierto || aportes.length === 0) return null;

  const base = calcularBaseMensual(aportes, config.meses_division, cotizacion);
  const { gastadoArs, ingresadoArs, restanteArs } = calcularRestanteDelMes(
    base.ars,
    mesDB,
    movimientos,
    fijos,
    historicos,
    cotizacion,
  );
  const porcentajeGastado = base.ars > 0 ? (gastadoArs / base.ars) * 100 : 0;
  const excedido = restanteArs < 0;

  return (
    <section className="mx-5 mb-4 rounded-lg border border-border p-4 md:mx-0">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">
          PRESUPUESTO DEL MES
        </span>
        <span className="text-xs text-muted-foreground">
          {formatARS(base.ars)}
        </span>
      </div>
      <p
        className={`text-2xl font-medium ${excedido ? "text-destructive" : ""}`}
      >
        {formatARS(restanteArs)}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {excedido ? "excedido" : "restante"} · gastado {formatARS(gastadoArs)}
        {ingresadoArs > 0 && ` · sumado ${formatARS(ingresadoArs)}`}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${excedido ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${Math.min(100, porcentajeGastado)}%` }}
        />
      </div>
    </section>
  );
}
