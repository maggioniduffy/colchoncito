"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { guardarCotizacionActiva } from "./actions";
import { formatRelativeTime } from "@/lib/format";
import type { TipoCotizacion } from "@/lib/types";

const OPCIONES: {
  key: Exclude<TipoCotizacion, "custom">;
  label: string;
  descripcion: string;
}[] = [
  { key: "oficial", label: "Oficial", descripcion: "BCRA · venta" },
  { key: "mep", label: "MEP", descripcion: "AL30" },
  { key: "blue", label: "Blue", descripcion: "promedio informal" },
  { key: "crypto", label: "Crypto", descripcion: "USDT" },
];

export default function CotizacionPage() {
  const cotizaciones = useCotizacionStore((s) => s.cotizaciones);
  const activa = useCotizacionStore((s) => s.activa);
  const setActiva = useCotizacionStore((s) => s.setActiva);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (tipo: Exclude<TipoCotizacion, "custom">) => {
    if (tipo === activa) return;

    // Optimistic update: cambio local al toque, server action en background
    setActiva(tipo);

    startTransition(async () => {
      const result = await guardarCotizacionActiva(tipo);
      if (result.error) {
        // Revertir si falla
        setActiva(activa);
        console.error("Error guardando cotización:", result.error);
      }
    });
  };

  return (
    <>
      <header className="mb-4 flex items-center gap-2 px-5">
        <Link href="/" className="text-primary">
          ←
        </Link>
        <div>
          <p className="text-lg font-medium">Cotización</p>
          <p className="text-xs text-muted-foreground">
            ¿Qué valor usar para convertir?
          </p>
        </div>
      </header>

      <div className="mx-5 flex flex-col gap-2">
        {OPCIONES.map(({ key, label, descripcion }) => {
          const cot = cotizaciones[key];
          const seleccionada = key === activa;
          const valor = cot?.valorVenta;
          const actualizado = cot?.fetchedAt
            ? formatRelativeTime(cot.fetchedAt)
            : "sin datos";

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={isPending || !cot}
              className={`flex items-center justify-between rounded-lg p-3.5 text-left transition-all disabled:opacity-50 ${
                seleccionada
                  ? "border-2 border-primary bg-primary/10"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              <div>
                <div
                  className={`text-sm font-medium ${seleccionada ? "text-primary" : ""}`}
                >
                  {label}
                </div>
                <div
                  className={`text-[11px] ${
                    seleccionada ? "text-primary/70" : "text-muted-foreground"
                  }`}
                >
                  {seleccionada ? "activa · " : ""}
                  {descripcion}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${seleccionada ? "text-primary" : ""}`}
                  >
                    {valor ? `$${valor.toLocaleString("es-AR")}` : "—"}
                  </div>
                  <div
                    className={`text-[10px] ${
                      seleccionada ? "text-primary/70" : "text-muted-foreground"
                    }`}
                  >
                    {actualizado}
                  </div>
                </div>
                <div
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                    seleccionada
                      ? "bg-primary text-[11px] text-primary-foreground"
                      : "border-[1.5px] border-border"
                  }`}
                >
                  {seleccionada && "✓"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-5 mt-4 rounded-lg bg-muted p-3 text-[11px] text-muted-foreground">
        <div className="mb-1 text-xs font-medium text-foreground">
          Cotización personalizada
        </div>
        Si compraste dólares a un valor distinto, podés fijar uno manual para
        este mes. (pendiente)
      </div>
    </>
  );
}
