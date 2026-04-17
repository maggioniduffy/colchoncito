"use client";

import { useState, useMemo, useTransition } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { convertirMonto } from "@/lib/calculos/conversion";
import { formatARS, formatUSD } from "@/lib/format";
import { borrarAporte } from "@/app/(app)/presupuesto/actions";
import AporteModal from "./aporte-modal";
import ConfirmModal from "./confirm-modal";
import type { PresupuestoAporte, Categoria } from "@/lib/types";
import { guardarConfigAnual } from "@/app/(app)/presupuesto/actions";
import type { PresupuestoConfigAnual } from "@/lib/types";

export default function PresupuestoView({
  año,
  aportes,
  categorias,
  config,
}: {
  año: number;
  aportes: PresupuestoAporte[];
  categorias: Categoria[];
  config: PresupuestoConfigAnual;
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<PresupuestoAporte | null>(null);
  const [borrando, setBorrando] = useState<PresupuestoAporte | null>(null);
  const [mesesDiv, setMesesDiv] = useState(config.meses_division);
  const [desdeMes, setDesdeMes] = useState(config.desde_mes);
  const [, startTransition] = useTransition();

  const handleConfigChange = (meses: number, desde: number) => {
    setMesesDiv(meses);
    setDesdeMes(desde);
    startTransition(async () => {
      await guardarConfigAnual(año, meses, desde);
    });
  };

  const totales = useMemo(() => {
    let totalArs = 0;
    let totalUsd = 0;

    for (const a of aportes) {
      const { ars, usd } = convertirMonto(
        Number(a.monto),
        a.moneda,
        cotizacion,
      );
      totalArs += ars;
      totalUsd += usd;
    }

    return {
      totalArs,
      totalUsd,
    };
  }, [aportes, cotizacion]);

  const baseMensualArs = mesesDiv > 0 ? totales.totalArs / mesesDiv : 0;
  const baseMensualUsd = baseMensualArs / cotizacion;

  const categoriaPorId = useMemo(() => {
    const map = new Map<number, Categoria>();
    for (const c of categorias) map.set(c.id, c);
    return map;
  }, [categorias]);

  const handleConfirmarBorrar = async () => {
    if (!borrando) return;
    await borrarAporte(borrando.id);
    setBorrando(null);
  };

  if (aportes.length === 0) {
    return (
      <>
        <div className="mx-5 rounded-xl border border-dashed border-border p-8 text-center md:mx-0">
          <div className="mb-3 text-4xl">💰</div>
          <p className="text-sm font-medium">
            Todavía no cargaste aportes para {año}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sumá los montos con los que arrancás el año:
            <br />
            USD del colchón, aguinaldo, ahorros, etc.
          </p>
          <button
            onClick={() => setCreando(true)}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Cargar primer aporte
          </button>
        </div>

        {creando && (
          <AporteModal
            año={año}
            categorias={categorias}
            onClose={() => setCreando(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0">
        <div>
          <p className="text-lg font-medium md:text-2xl">Presupuesto</p>
          <p className="text-xs text-muted-foreground">Año {año}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/presupuesto/reportes"
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted md:text-sm"
          >
            Reportes
          </a>
          <button
            onClick={() => setCreando(true)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 md:text-sm"
          >
            + Aporte
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <section className="mx-5 mb-4 rounded-xl bg-primary/10 p-4 md:mx-0 md:p-6">
          <p className="text-[11px] font-medium text-primary md:text-xs">
            FONDO DEL AÑO
          </p>
          <p className="mt-1 text-2xl font-medium text-primary md:text-4xl">
            {formatARS(totales.totalArs)}
          </p>
          <p className="text-xs text-primary/70 md:text-sm">
            {formatUSD(totales.totalUsd)}
          </p>
        </section>

        <section className="mx-5 mb-4 rounded-xl bg-muted p-4 md:mx-0 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-medium text-muted-foreground md:text-xs">
              BASE MENSUAL
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">÷</span>
              <select
                value={mesesDiv}
                onChange={(e) =>
                  handleConfigChange(parseInt(e.target.value), desdeMes)
                }
                className="rounded border border-border bg-background px-2 py-0.5"
              >
                {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} meses
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground">desde</span>
              <select
                value={desdeMes}
                onChange={(e) =>
                  handleConfigChange(mesesDiv, parseInt(e.target.value))
                }
                className="rounded border border-border bg-background px-2 py-0.5"
              >
                {[
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic",
                ].map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-2xl font-medium md:text-4xl">
            {formatARS(baseMensualArs)}
          </p>
          <p className="text-xs text-muted-foreground md:text-sm">
            {formatUSD(baseMensualUsd)}
          </p>
        </section>
      </div>

      {/* Lista */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="mx-5 mb-2 text-[11px] text-muted-foreground md:mx-0 md:text-xs">
          APORTES ({aportes.length})
        </div>

        <div className="mx-5 flex-1 min-h-0 flex flex-col gap-1.5 overflow-y-auto pr-1 md:mx-0">
          {aportes.map((aporte) => {
            const cat = aporte.categoria_id
              ? categoriaPorId.get(aporte.categoria_id)
              : null;

            const { ars, usd } = convertirMonto(
              Number(aporte.monto),
              aporte.moneda,
              cotizacion,
            );

            return (
              <button
                key={aporte.id}
                onClick={() => setEditando(aporte)}
                className="group relative flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left hover:bg-muted/50 md:px-4 md:py-3.5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium md:text-base">
                      {aporte.nombre}
                    </span>
                    {cat && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                        style={{
                          backgroundColor: cat.color + "33",
                          color: cat.color,
                        }}
                      >
                        {cat.nombre.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground md:text-xs">
                    {new Date(aporte.fecha_aporte).toLocaleDateString("es-AR")}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium md:text-base">
                    {aporte.moneda === "USD" ? formatUSD(usd) : formatARS(ars)}
                  </div>
                  <div className="text-[10px] text-muted-foreground md:text-xs">
                    {aporte.moneda === "USD" ? formatARS(ars) : formatUSD(usd)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {creando && (
        <AporteModal
          año={año}
          categorias={categorias}
          onClose={() => setCreando(false)}
        />
      )}
      {editando && (
        <AporteModal
          año={año}
          aporte={editando}
          categorias={categorias}
          onClose={() => setEditando(null)}
        />
      )}
      {borrando && (
        <ConfirmModal
          titulo="Borrar aporte"
          mensaje={`¿Borrar "${borrando.nombre}"?`}
          textoConfirmar="Borrar"
          variante="destructive"
          onConfirmar={handleConfirmarBorrar}
          onCancelar={() => setBorrando(null)}
        />
      )}
    </div>
  );
}
