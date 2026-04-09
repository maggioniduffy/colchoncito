"use client";

import Link from "next/link";
import { useCotizacionStore } from "@/stores/cotizacion-store";

const ITEMS = [
  { key: "oficial", label: "OFICIAL" },
  { key: "mep", label: "MEP" },
  { key: "blue", label: "BLUE" },
  { key: "crypto", label: "CRYPTO" },
] as const;

export function BarraCotizaciones() {
  const cotizaciones = useCotizacionStore((s) => s.cotizaciones);
  const activa = useCotizacionStore((s) => s.activa);

  return (
    <Link
      href="/cotizacion"
      className="mx-5 mb-4 flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2.5 active:opacity-80"
    >
      {ITEMS.map((item) => {
        const cot = cotizaciones[item.key];
        const esActiva = item.key === activa;
        return (
          <div key={item.key} className={esActiva ? "text-primary" : ""}>
            <div className="text-[10px] text-muted-foreground">
              {item.label}
            </div>
            <div className="text-xs font-medium">
              {cot ? `$${cot.valorVenta.toLocaleString("es-AR")}` : "—"}
            </div>
          </div>
        );
      })}
    </Link>
  );
}
