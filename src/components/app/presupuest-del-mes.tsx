"use client";

import { useState } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import {
  calcularBaseMensual,
  calcularRestanteDelMes,
  mesEstaCubierto,
} from "@/lib/calculos/presupuesto-mensual";
import { formatARS, toMesDB, mesDBaLabel } from "@/lib/format";
import CierreMesModal from "./cierre-mes-modal";
import type {
  PresupuestoAporte,
  PresupuestoConfigAnual,
  MovimientoParticular,
  HistoricoMonto,
  MovimientoFijo,
  CierreMes,
} from "@/lib/types";

export default function PresupuestoDelMes({
  mesDB,
  aportes,
  config,
  movimientos,
  fijos,
  historicos,
  cierreMes,
}: {
  mesDB: string;
  aportes: PresupuestoAporte[];
  config: PresupuestoConfigAnual;
  movimientos: MovimientoParticular[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
  cierreMes?: CierreMes | null;
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());
  const [mostrarModalCierre, setMostrarModalCierre] = useState(false);

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

  const mesActualDB = toMesDB();
  const esMesFinalizado = mesDB < mesActualDB;
  const nombreMes = mesDBaLabel(mesDB);

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

      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-2xl font-medium ${
              excedido ? "text-destructive" : ""
            }`}
          >
            {formatARS(restanteArs)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {excedido ? "excedido" : "restante"} · gastado {formatARS(gastadoArs)}
            {ingresadoArs > 0 && ` · sumado ${formatARS(ingresadoArs)}`}
          </p>
        </div>

        {(esMesFinalizado || restanteArs > 0 || cierreMes) && (
          <button
            type="button"
            onClick={() => setMostrarModalCierre(true)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-muted"
          >
            {cierreMes ? "Ver cierre" : "Mover remanente"}
          </button>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${excedido ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${Math.min(100, porcentajeGastado)}%` }}
        />
      </div>

      {/* Banner estado de cierre */}
      {cierreMes ? (
        <div className="mt-3 flex items-center justify-between rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          <span>
            ✓ Mes cerrado · Remanente de {formatARS(cierreMes.monto)}{" "}
            {cierreMes.accion === "aporte"
              ? "sumado al presupuesto general"
              : cierreMes.accion === "mes_siguiente"
                ? "pasado al mes siguiente"
                : "registrado (sin mover)"}
          </span>
          <button
            type="button"
            onClick={() => setMostrarModalCierre(true)}
            className="ml-2 font-medium underline hover:opacity-80"
          >
            Cambiar
          </button>
        </div>
      ) : esMesFinalizado && restanteArs > 0 ? (
        <div className="mt-3 flex items-center justify-between rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
          <span>
            🎉 Este mes finalizó con {formatARS(restanteArs)} sobrantes. Podés
            moverlos al presupuesto general o al mes siguiente.
          </span>
          <button
            type="button"
            onClick={() => setMostrarModalCierre(true)}
            className="ml-2 shrink-0 rounded bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90"
          >
            Mover
          </button>
        </div>
      ) : null}

      {mostrarModalCierre && (
        <CierreMesModal
          mesDB={mesDB}
          sobrante={cierreMes ? cierreMes.monto : Math.max(0, restanteArs)}
          nombreMes={nombreMes}
          accionExistente={cierreMes?.accion}
          onClose={() => setMostrarModalCierre(false)}
        />
      )}
    </section>
  );
}
