"use client";

import Link from "next/link";
import { useCotizacionStore } from "@/stores/cotizacion-store";

const ITEMS = [
  { key: "oficial", label: "Oficial" },
  { key: "mep", label: "MEP" },
  { key: "blue", label: "Blue" },
  { key: "crypto", label: "Crypto" },
] as const;

export default function DesktopCotizaciones() {
  const cotizaciones = useCotizacionStore((s) => s.cotizaciones);
  const activa = useCotizacionStore((s) => s.activa);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          COTIZACIONES
        </p>
        <Link href="/cotizacion" className="text-xs text-primary">
          Cambiar →
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {ITEMS.map((item) => {
          const cot = cotizaciones[item.key];
          const esActiva = item.key === activa;
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${
                esActiva ? "bg-primary/10" : ""
              }`}
            >
              <span
                className={`text-sm ${
                  esActiva ? "font-medium text-primary" : ""
                }`}
              >
                {item.label}
              </span>
              <span
                className={`text-sm ${
                  esActiva ? "font-medium text-primary" : ""
                }`}
              >
                {cot ? `$${cot.valorVenta.toLocaleString("es-AR")}` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
