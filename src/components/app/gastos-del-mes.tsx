"use client";

import { useMemo } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { convertirMonto } from "@/lib/calculos/conversion";
import { formatARS } from "@/lib/format";
import type { MovimientoParticular } from "@/lib/types";

export default function GastosDelMes({
  movimientos,
}: {
  movimientos: MovimientoParticular[];
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const { totalEgresos, top3 } = useMemo(() => {
    const egresos = movimientos.filter((m) => m.tipo === "egreso");

    const conArs = egresos.map((m) => {
      const { ars } = convertirMonto(m.monto, m.moneda_anclaje, cotizacion);
      return { ...m, ars };
    });

    const total = conArs.reduce((acc, m) => acc + m.ars, 0);
    const top = [...conArs].sort((a, b) => b.ars - a.ars).slice(0, 3);

    return { totalEgresos: total, top3: top };
  }, [movimientos, cotizacion]);

  return (
    <section className="mx-5 mb-4 md:mx-0 md:mt-6 md:rounded-xl md:border md:border-border md:p-6">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium md:text-base">Gastos del mes</span>
        <span className="text-[11px] text-muted-foreground md:text-xs">
          {formatARS(totalEgresos)}
        </span>
      </div>

      {top3.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Todavía no cargaste gastos este mes.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-1.5 md:mt-4 md:gap-2">
          {top3.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-xs md:text-sm"
            >
              <span className="text-muted-foreground">{item.nombre}</span>
              <span>{formatARS(item.ars)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
