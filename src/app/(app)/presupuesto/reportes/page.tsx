"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { mockData } from "@/lib/mock-data";
import { formatARS } from "@/lib/format";

export default function ReportesPage() {
  const { evolucionMensual, presupuestoAnual } = mockData;

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Link href="/presupuesto" className="text-primary">
            ←
          </Link>
          <p className="text-lg font-medium">Reportes</p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
          Anual {presupuestoAnual.año}
        </span>
      </header>

      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-muted-foreground">
          EVOLUCIÓN MENSUAL
        </p>
        <div className="rounded-lg border border-border p-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={evolucionMensual}
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
                  width={36}
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
          COMPOSICIÓN POR CATEGORÍA
        </p>
        <div className="rounded-lg border border-border p-3">
          {presupuestoAnual.categorias.map((cat) => (
            <div key={cat.nombre} className="py-1.5">
              <div className="mb-1 flex justify-between text-xs">
                <span>{cat.nombre}</span>
                <span className="text-muted-foreground">
                  {cat.porcentaje.toFixed(1)}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full"
                  style={{
                    width: `${cat.porcentaje}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-muted-foreground">
          AHORRO ACUMULADO EN USD
        </p>
        <div className="rounded-lg border border-border p-3 text-center text-xs text-muted-foreground">
          (gráfico pendiente — mostrará stock de USD mes a mes)
        </div>
      </section>
    </>
  );
}
