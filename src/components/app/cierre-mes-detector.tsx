"use client";

import { useState, useEffect } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import {
  calcularSobranteMes,
  getMesAnteriorDB,
  estamosEnVentanaDeCierre,
} from "@/lib/calculos/sobrante-mes";
import CierreMesModal from "./cierre-mes-modal";
import type {
  PresupuestoAporte,
  PresupuestoConfigAnual,
  MovimientoParticular,
  MovimientoFijo,
  HistoricoMonto,
} from "@/lib/types";

export default function CierreMesDetector({
  aportes,
  config,
  movimientosMesAnterior,
  fijos,
  historicos,
  cierreMesAnteriorYaResuelto,
}: {
  aportes: PresupuestoAporte[];
  config: PresupuestoConfigAnual;
  movimientosMesAnterior: MovimientoParticular[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
  cierreMesAnteriorYaResuelto: boolean;
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());
  const [mostrarModal, setMostrarModal] = useState(false);

  const mesAnteriorDB = getMesAnteriorDB();
  const enVentana = estamosEnVentanaDeCierre(10); // primeros 10 días del mes

  const sobrante = calcularSobranteMes(
    mesAnteriorDB,
    aportes,
    config,
    movimientosMesAnterior,
    fijos,
    historicos,
    cotizacion,
  );

  useEffect(() => {
    if (enVentana && sobrante > 0 && !cierreMesAnteriorYaResuelto) {
      // Pequeño delay para que no aparezca instantáneo al cargar
      const timer = setTimeout(() => setMostrarModal(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [enVentana, sobrante, cierreMesAnteriorYaResuelto]);

  if (!mostrarModal) return null;

  const nombreMes = new Date(mesAnteriorDB).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  return (
    <CierreMesModal
      mesDB={mesAnteriorDB}
      sobrante={sobrante}
      nombreMes={nombreMes}
      onClose={() => setMostrarModal(false)}
    />
  );
}
