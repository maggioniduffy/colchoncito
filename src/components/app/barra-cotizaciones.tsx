import { mockData } from "@/lib/mock-data";
import Link from "next/link";

const ITEMS = [
  { key: "oficial", label: "OFICIAL" },
  { key: "mep", label: "MEP" },
  { key: "blue", label: "BLUE" },
  { key: "crypto", label: "CRYPTO" },
] as const;

export function BarraCotizaciones() {
  const { cotizaciones, cotizacionActiva } = mockData;

  return (
    <Link
      href="/cotizacion"
      className="mx-5 mb-4 flex items-center justify-between gap-3 rounded-lg bg-gray-100 px-3 py-2.5 active:bg-gray-200"
    >
      {ITEMS.map((item) => {
        const activa = item.key === cotizacionActiva;
        return (
          <div
            key={item.key}
            className={activa ? "text-blue-700" : "text-gray-900"}
          >
            <div className="text-[10px] text-gray-500">{item.label}</div>
            <div className="text-xs font-medium">
              ${cotizaciones[item.key].valor.toLocaleString("es-AR")}
            </div>
          </div>
        );
      })}
    </Link>
  );
}
