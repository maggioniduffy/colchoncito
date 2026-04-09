"use client";

import { useEffect } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import type { CotizacionData } from "@/lib/cotizaciones/fetch";
import type { TipoCotizacion } from "@/lib/mock-data";

export default function CotizacionLoader({
  cotizaciones,
  activa,
}: {
  cotizaciones: CotizacionData[];
  activa: TipoCotizacion;
}) {
  const setCotizaciones = useCotizacionStore((s) => s.setCotizaciones);
  const setActiva = useCotizacionStore((s) => s.setActiva);

  useEffect(() => {
    setCotizaciones(cotizaciones);
    setActiva(activa);
  }, [cotizaciones, activa, setCotizaciones, setActiva]);

  return null;
}
