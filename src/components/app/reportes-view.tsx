"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { convertirMonto } from "@/lib/calculos/conversion";
import { fijosVigentesEnMes } from "@/lib/calculos/fijos-del-mes";
import { montoVigenteEnMes } from "@/lib/calculos/monto-vigente";
import { totalDelFondoAnual } from "@/lib/calculos/disponible";
import { formatARS } from "@/lib/format";
import type {
  PresupuestoAporte,
  MovimientoParticular,
  MovimientoFijo,
  HistoricoMonto,
  Categoria,
} from "@/lib/types";

const MESES = [
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
];

export default function ReportesView({
  año,
  aportes,
  movimientos,
  categorias,
  fijos,
  historicos,
}: {
  año: number;
  aportes: PresupuestoAporte[];
  movimientos: MovimientoParticular[];
  categorias: Categoria[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const fondoAnual = totalDelFondoAnual(aportes, cotizacion);

  const evolucion = useMemo(() => {
    return MESES.map((nombre, i) => {
      const mesDB = `${año}-${String(i + 1).padStart(2, "0")}-01`;
      let ingresos = 0;
      let egresos = 0;

      const particularesDelMes = movimientos.filter((m) => m.mes === mesDB);
      for (const m of particularesDelMes) {
        const { ars } = convertirMonto(
          Number(m.monto),
          m.moneda_anclaje,
          cotizacion,
        );
        if (m.tipo === "ingreso") ingresos += ars;
        else egresos += ars;
      }

      const fijosVigentes = fijosVigentesEnMes(fijos, mesDB);
      for (const f of fijosVigentes) {
        const hist = historicos.filter((h) => h.movimiento_fijo_id === f.id);
        const monto = montoVigenteEnMes(mesDB, Number(f.monto), hist);
        const { ars } = convertirMonto(monto, f.moneda_anclaje, cotizacion);
        if (f.tipo === "ingreso") ingresos += ars;
        else egresos += ars;
      }

      return {
        mes: nombre,
        ingresos: Math.round(ingresos),
        egresos: Math.round(egresos),
      };
    });
  }, [año, movimientos, fijos, historicos, cotizacion]);

  // Gasto total del año por categoría
  const gastoPorCategoria = useMemo(() => {
    const map = new Map<number, number>();
    const nombreCat = new Map<number, Categoria>();
    for (const c of categorias) nombreCat.set(c.id, c);

    for (const m of movimientos) {
      if (m.tipo !== "egreso" || !m.categoria_id) continue;
      const { ars } = convertirMonto(
        Number(m.monto),
        m.moneda_anclaje,
        cotizacion,
      );
      map.set(m.categoria_id, (map.get(m.categoria_id) ?? 0) + ars);
    }

    for (let i = 0; i < 12; i++) {
      const mesDB = `${año}-${String(i + 1).padStart(2, "0")}-01`;
      const vigentes = fijosVigentesEnMes(fijos, mesDB);
      for (const f of vigentes) {
        if (f.tipo !== "egreso" || !f.categoria_id) continue;
        const hist = historicos.filter((h) => h.movimiento_fijo_id === f.id);
        const monto = montoVigenteEnMes(mesDB, Number(f.monto), hist);
        const { ars } = convertirMonto(monto, f.moneda_anclaje, cotizacion);
        map.set(f.categoria_id, (map.get(f.categoria_id) ?? 0) + ars);
      }
    }

    return Array.from(map.entries())
      .map(([catId, total]) => ({
        categoria: nombreCat.get(catId),
        total,
      }))
      .filter((x) => x.categoria)
      .sort((a, b) => b.total - a.total);
  }, [año, movimientos, fijos, historicos, cotizacion, categorias]);

  const totalGastadoAño = gastoPorCategoria.reduce(
    (acc, x) => acc + x.total,
    0,
  );

  return (
    <>
      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-muted-foreground">
          EVOLUCIÓN MENSUAL
        </p>
        <div className="rounded-lg border border-border p-3">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={evolucion}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={40}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? formatARS(value) : String(value)
                  }
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="egresos"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 bg-green-600" />
              <span className="text-muted-foreground">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 bg-red-600" />
              <span className="text-muted-foreground">Egresos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-muted-foreground">
          GASTO TOTAL DEL AÑO · por categoría
        </p>
        <div className="rounded-lg border border-border p-3">
          {gastoPorCategoria.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Todavía no hay gastos con categoría asignada
            </p>
          ) : (
            gastoPorCategoria.map(({ categoria, total }) => {
              const porcentaje =
                totalGastadoAño > 0 ? (total / totalGastadoAño) * 100 : 0;
              return (
                <div key={categoria!.id} className="py-2">
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span>{categoria!.nombre}</span>
                    <span className="text-muted-foreground">
                      {formatARS(total)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full"
                      style={{
                        width: `${porcentaje}%`,
                        backgroundColor: categoria!.color,
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {porcentaje.toFixed(1)}% del total
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {aportes.length > 0 && (
        <section className="mx-5 mb-5">
          <p className="mb-2 text-[11px] text-muted-foreground">
            FONDO DEL AÑO VS GASTADO
          </p>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                Fondo inicial
              </span>
              <span className="text-sm font-medium">
                {formatARS(fondoAnual.ars)}
              </span>
            </div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Gastado</span>
              <span className="text-sm font-medium text-destructive">
                −{formatARS(totalGastadoAño)}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium">Restante del fondo</span>
                <span className="text-sm font-medium">
                  {formatARS(fondoAnual.ars - totalGastadoAño)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
