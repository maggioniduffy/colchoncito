"use client";

import { useState } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { convertirMonto } from "@/lib/calculos/conversion";
import { formatARS, formatUSD } from "@/lib/format";
import { borrarCuenta } from "@/app/(app)/cuentas/actions";
import CuentaModal from "./cuenta-modal";
import ConfirmModal from "./confirm-modal";
import type { Cuenta, TipoCuenta } from "@/lib/types";

const GRUPOS: {
  tipo: TipoCuenta;
  titulo: string;
  colorTotal: string;
}[] = [
  {
    tipo: "liquido",
    titulo: "LÍQUIDO · disponible ya",
    colorTotal: "text-emerald-600 dark:text-emerald-400",
  },
  {
    tipo: "por_cobrar",
    titulo: "POR COBRAR",
    colorTotal: "text-emerald-600 dark:text-emerald-400",
  },
  {
    tipo: "comprometido",
    titulo: "COMPROMETIDO",
    colorTotal: "text-destructive",
  },
];

export default function CuentasList({ cuentas }: { cuentas: Cuenta[] }) {
  const [editando, setEditando] = useState<Cuenta | null>(null);
  const [creando, setCreando] = useState(false);
  const [borrando, setBorrando] = useState<Cuenta | null>(null);
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const handleConfirmarBorrar = async () => {
    if (!borrando) return;
    await borrarCuenta(borrando.id);
    setBorrando(null);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0">
        <p className="text-lg font-medium md:text-2xl">Cuentas</p>
        <button
          onClick={() => setCreando(true)}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 md:text-sm"
        >
          + Nueva cuenta
        </button>
      </div>

      {cuentas.length === 0 && (
        <div className="mx-5 rounded-lg border border-dashed border-border p-8 text-center md:mx-0">
          <p className="text-sm text-muted-foreground">
            No tenés cuentas todavía.
          </p>
          <button
            onClick={() => setCreando(true)}
            className="mt-3 text-sm font-medium text-primary"
          >
            Crear la primera →
          </button>
        </div>
      )}

      {GRUPOS.map((grupo) => {
        const items = cuentas.filter((c) => c.tipo === grupo.tipo);
        if (items.length === 0) return null;

        const totalArs = items.reduce((acc, c) => {
          const { ars } = convertirMonto(c.saldo_actual, c.moneda, cotizacion);
          return acc + ars;
        }, 0);

        return (
          <section key={grupo.tipo} className="mx-5 mb-4 md:mx-0 md:mb-6">
            <div className="mb-1.5 flex justify-between text-[11px] md:mb-2 md:text-xs">
              <span className="text-muted-foreground">{grupo.titulo}</span>
              <span className={`font-medium ${grupo.colorTotal}`}>
                {formatARS(totalArs, { showSign: grupo.tipo !== "liquido" })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
              {items.map((cuenta) => {
                const { ars, usd } = convertirMonto(
                  cuenta.saldo_actual,
                  cuenta.moneda,
                  cotizacion,
                );
                return (
                  <button
                    key={cuenta.id}
                    onClick={() => setEditando(cuenta)}
                    className="group relative flex w-full cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50 md:px-4 md:py-3.5"
                  >
                    {/* Tooltip "Editar" */}
                    <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                      Editar
                    </span>

                    <div className="flex-1">
                      <div className="text-sm font-medium md:text-base">
                        {cuenta.nombre}
                      </div>
                      {cuenta.notas && (
                        <div className="text-[11px] text-muted-foreground md:text-xs">
                          {cuenta.notas}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium md:text-base ${
                            cuenta.tipo === "comprometido"
                              ? "text-destructive"
                              : ""
                          }`}
                        >
                          {cuenta.moneda === "USD"
                            ? formatUSD(usd)
                            : formatARS(ars)}
                        </div>
                        <div className="text-[10px] text-muted-foreground md:text-xs">
                          {cuenta.moneda === "USD"
                            ? formatARS(ars)
                            : formatUSD(usd)}
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setBorrando(cuenta);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            setBorrando(cuenta);
                          }
                        }}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-lg text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        title="Borrar"
                        aria-label={`Borrar ${cuenta.nombre}`}
                      >
                        ×
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {creando && <CuentaModal onClose={() => setCreando(false)} />}
      {editando && (
        <CuentaModal cuenta={editando} onClose={() => setEditando(null)} />
      )}
      {borrando && (
        <ConfirmModal
          titulo="Borrar cuenta"
          mensaje={`¿Estás seguro de borrar "${borrando.nombre}"? Esta acción no se puede deshacer.`}
          textoConfirmar="Borrar"
          variante="destructive"
          onConfirmar={handleConfirmarBorrar}
          onCancelar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
