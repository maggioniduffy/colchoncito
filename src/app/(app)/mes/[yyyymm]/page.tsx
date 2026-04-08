import { formatARS, formatUSD } from "@/lib/format";
import { mockData } from "@/lib/mock-data";

export default function MesPage({ params }: { params: { yyyymm: string } }) {
  // TODO: cargar mes según params.yyyymm. Por ahora usa el mock.
  const { mesDetalle } = mockData;

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5">
        <div>
          <p className="text-[11px] text-gray-500">MES</p>
          <p className="text-lg font-medium text-gray-900">
            ◀ {mesDetalle.nombre} ▶
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
          MEP · $1.414
        </span>
      </header>

      <div className="mx-5 mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-green-50 p-2.5">
          <div className="text-[10px] text-green-800">INGRESOS</div>
          <div className="mt-0.5 text-[15px] font-medium text-green-800">
            {formatARS(mesDetalle.ingresos.total)}
          </div>
        </div>
        <div className="rounded-lg bg-red-50 p-2.5">
          <div className="text-[10px] text-red-800">EGRESOS</div>
          <div className="mt-0.5 text-[15px] font-medium text-red-800">
            {formatARS(mesDetalle.egresos.total)}
          </div>
        </div>
      </div>

      <div className="mx-5 mb-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          INGRESOS FIJOS · recurrentes
        </span>
        <button className="text-[11px] text-blue-600">+ agregar</button>
      </div>

      <div className="mx-5 mb-4 flex flex-col gap-1.5">
        {mesDetalle.ingresos.fijos.map((item) => (
          <MovimientoRow key={item.id} item={item} punteado={false} />
        ))}
      </div>

      <div className="mx-5 mb-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">SOLO ESTE MES</span>
        <button className="text-[11px] text-blue-600">+ agregar</button>
      </div>

      <div className="mx-5 mb-5 flex flex-col gap-1.5">
        {mesDetalle.ingresos.particulares.map((item) => (
          <MovimientoRow key={item.id} item={item} punteado />
        ))}
      </div>

      <section className="mx-5 mb-4 rounded-lg bg-blue-50 p-3">
        <div className="flex justify-between text-xs text-blue-900">
          <span>Balance del mes</span>
          <span className="font-medium">
            {formatARS(mesDetalle.balance, { showSign: true })}
          </span>
        </div>
      </section>
    </>
  );
}

function MovimientoRow({
  item,
  punteado,
}: {
  item: {
    nombre: string;
    subtitulo: string;
    montoArs: number;
    montoUsd: number;
    monedaAnclaje: "ARS" | "USD";
  };
  punteado: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
        punteado
          ? "border border-dashed border-gray-300"
          : "border border-gray-200"
      }`}
    >
      <div>
        <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
        <div className="text-[11px] text-gray-500">{item.subtitulo}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {item.monedaAnclaje === "USD"
            ? formatUSD(item.montoUsd)
            : formatARS(item.montoArs)}
        </div>
        <div className="text-[10px] text-gray-500">
          {item.monedaAnclaje === "USD"
            ? formatARS(item.montoArs)
            : formatUSD(item.montoUsd)}
        </div>
      </div>
    </div>
  );
}
