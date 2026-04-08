import Link from "next/link";
import { mockData, type TipoCotizacion } from "@/lib/mock-data";

const OPCIONES: { key: TipoCotizacion; label: string }[] = [
  { key: "oficial", label: "Oficial" },
  { key: "mep", label: "MEP" },
  { key: "blue", label: "Blue" },
  { key: "crypto", label: "Crypto" },
];

export default function CotizacionPage() {
  const { cotizaciones, cotizacionActiva } = mockData;

  return (
    <>
      <header className="mb-4 flex items-center gap-2 px-5">
        <Link href="/" className="text-blue-600">
          ←
        </Link>
        <div>
          <p className="text-lg font-medium text-gray-900">Cotización</p>
          <p className="text-xs text-gray-500">
            ¿Qué valor usar para convertir?
          </p>
        </div>
      </header>

      <div className="mx-5 flex flex-col gap-2">
        {OPCIONES.map(({ key, label }) => {
          const cot = cotizaciones[key];
          const activa = key === cotizacionActiva;

          return (
            <button
              key={key}
              className={`flex items-center justify-between rounded-lg p-3.5 text-left ${
                activa
                  ? "border-2 border-blue-600 bg-blue-50"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <div>
                <div
                  className={`text-sm font-medium ${
                    activa ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {label}
                </div>
                <div
                  className={`text-[11px] ${
                    activa ? "text-blue-900/70" : "text-gray-500"
                  }`}
                >
                  {activa ? "default · " : ""}
                  {cot.descripcion}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      activa ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    ${cot.valor.toLocaleString("es-AR")}
                  </div>
                  <div
                    className={`text-[10px] ${
                      activa ? "text-blue-900/70" : "text-gray-500"
                    }`}
                  >
                    {cot.actualizado}
                  </div>
                </div>
                <div
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                    activa
                      ? "bg-blue-600 text-[11px] text-white"
                      : "border-[1.5px] border-gray-300"
                  }`}
                >
                  {activa && "✓"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-5 mt-4 rounded-lg bg-gray-100 p-3 text-[11px] text-gray-600">
        <div className="mb-1 text-xs font-medium text-gray-900">
          Cotización personalizada
        </div>
        Si compraste dólares a un valor distinto, podés fijar uno manual para
        este mes.
      </div>
    </>
  );
}
