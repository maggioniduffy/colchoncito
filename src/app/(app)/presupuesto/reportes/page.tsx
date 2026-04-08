"use client";

import { formatARS } from "@/lib/format";
import { mockData } from "@/lib/mock-data";
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

export default function ReportesPage() {
  const { evolucionMensual, presupuestoAnual } = mockData;

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Link href="/presupuesto" className="text-blue-600">
            ←
          </Link>
          <p className="text-lg font-medium text-gray-900">Reportes</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
          Anual {presupuestoAnual.año}
        </span>
      </header>

      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-gray-500">EVOLUCIÓN MENSUAL</p>
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={evolucionMensual}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={36}
                />
                {/* <Tooltip
                  formatter={(value: number) => formatARS(value)}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                /> */}
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
              <span className="text-gray-500">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 bg-red-600" />
              <span className="text-gray-500">Egresos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-5 mb-5">
        <p className="mb-2 text-[11px] text-gray-500">
          COMPOSICIÓN POR CATEGORÍA
        </p>
        <div className="rounded-lg border border-gray-200 p-3">
          {presupuestoAnual.categorias.map((cat) => (
            <div key={cat.nombre} className="py-1.5">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-900">{cat.nombre}</span>
                <span className="text-gray-500">
                  {cat.porcentaje.toFixed(1)}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gray-100">
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
        <p className="mb-2 text-[11px] text-gray-500">
          AHORRO ACUMULADO EN USD
        </p>
        <div className="rounded-lg border border-gray-200 p-3 text-center text-xs text-gray-400">
          (gráfico pendiente — mostrará stock de USD mes a mes)
        </div>
      </section>
    </>
  );
}
