import type { MovimientoFijo } from "@/lib/types";

/**
 * Dado un array de movimientos fijos activos, devuelve los que
 * aplican a un mes específico según su plazo y fecha de inicio.
 *
 * mesDB: formato "YYYY-MM-01"
 */
export function fijosVigentesEnMes(
  fijos: MovimientoFijo[],
  mesDB: string,
): MovimientoFijo[] {
  return fijos.filter((f) => {
    if (!f.activo) return false;

    // El mes consultado tiene que ser >= fecha_inicio
    // Normalizamos fecha_inicio a YYYY-MM-01
    const inicioMes = f.fecha_inicio.slice(0, 7) + "-01";
    if (mesDB < inicioMes) return false;

    // Plazo indefinido: aplica siempre desde el inicio
    if (f.plazo_tipo === "indefinido") return true;

    // Plazo hasta_fecha: aplica si el mes es <= fecha_fin
    if (f.plazo_tipo === "hasta_fecha" && f.plazo_fecha_fin) {
      const finMes = f.plazo_fecha_fin.slice(0, 7) + "-01";
      return mesDB <= finMes;
    }

    // Plazo n_repeticiones: aplica si el mes está dentro del rango
    // desde fecha_inicio hasta fecha_inicio + n meses
    if (
      f.plazo_tipo === "n_repeticiones" &&
      f.plazo_repeticiones_restantes !== null
    ) {
      const [añoInicio, mesInicio] = inicioMes.split("-").map(Number);
      const [añoMes, mesMes] = mesDB.split("-").map(Number);

      const mesesDesdeInicio = (añoMes - añoInicio) * 12 + (mesMes - mesInicio);

      return (
        mesesDesdeInicio >= 0 &&
        mesesDesdeInicio < f.plazo_repeticiones_restantes
      );
    }

    return false;
  });
}
