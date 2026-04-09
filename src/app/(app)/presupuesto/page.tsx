import Link from "next/link";
import { mockData } from "@/lib/mock-data";
import { formatARS, formatUSD } from "@/lib/format";

export default function PresupuestoPage() {
  const { presupuestoAnual } = mockData;

  return (
    <>
      <header className="mb-4 flex items-start justify-between px-5 md:mb-6 md:px-0">
        <div>
          <p className="text-lg font-medium text-gray-900 md:text-2xl">
            Presupuesto
          </p>
          <div className="mt-2.5 flex gap-1.5">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
              Anual
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              Mensual
            </span>
          </div>
        </div>
        <Link
          href="/presupuesto/reportes"
          className="text-xs font-medium text-blue-600 md:text-sm"
        >
          Reportes →
        </Link>
      </header>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <section className="mx-5 mb-4 rounded-lg bg-gray-100 p-3.5 md:col-span-1 md:mx-0 md:rounded-xl md:bg-blue-50 md:p-6">
          <div className="flex justify-between text-[11px] text-gray-500 md:text-xs md:text-blue-900">
            <span>TOTAL {presupuestoAnual.año}</span>
            <span>MONEDA: ARS</span>
          </div>
          <p className="mt-1 text-2xl font-medium text-gray-900 md:mt-2 md:text-4xl md:text-blue-900">
            {formatARS(presupuestoAnual.totalArs)}
          </p>
          <p className="text-xs text-gray-500 md:mt-1 md:text-sm md:text-blue-900/70">
            {formatUSD(presupuestoAnual.totalUsd)} · cot. MEP
          </p>

          <button className="mt-4 hidden w-full rounded-lg bg-white p-3 text-left text-xs text-blue-900 hover:bg-blue-100 md:block">
            <div className="font-medium">↓ Derivar a mensual</div>
            <div className="mt-0.5 opacity-75">
              Distribuye en los meses restantes
            </div>
          </button>
        </section>

        <div className="md:col-span-2">
          <div className="mx-5 mb-1.5 text-[11px] text-gray-500 md:mx-0 md:text-xs">
            DISTRIBUCIÓN
          </div>

          <div className="mx-5 md:mx-0 md:rounded-xl md:border md:border-gray-200 md:p-4">
            {presupuestoAnual.categorias.map((cat, i) => (
              <div
                key={cat.nombre}
                className={`py-2.5 md:py-3 ${
                  i < presupuestoAnual.categorias.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-900">{cat.nombre}</span>
                  <span className="font-medium text-gray-900">
                    {formatARS(cat.anual)}
                  </span>
                </div>
                <div className="mt-0.5 flex justify-between text-[11px] text-gray-500 md:text-xs">
                  <span>{cat.mensual}</span>
                  <span>{cat.porcentaje.toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100 md:mt-2 md:h-1.5">
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
        </div>
      </div>

      <button className="mx-5 my-4 w-[calc(100%-2.5rem)] rounded-lg bg-blue-50 p-3 text-left text-xs text-blue-900 active:bg-blue-100 md:hidden">
        <div className="font-medium">↓ Derivar a mensual</div>
        <div className="mt-0.5 opacity-75">
          Distribuye cada categoría en los meses restantes
        </div>
      </button>
    </>
  );
}
