import { BarraCotizaciones } from "@/components/app/barra-cotizaciones";
import { formatARS, formatUSD } from "@/lib/format";
import { mockData } from "@/lib/mock-data";

export default function Dashboard() {
  const { user, disponiblePorMes, saldos, gastosMesActual } = mockData;
  const progresoGastos = Math.min(
    100,
    (gastosMesActual.total / gastosMesActual.presupuesto) * 100,
  );

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5">
        <div>
          <p className="text-sm text-gray-500">Hola, {user.nombre}</p>
          <p className="text-base font-medium text-gray-900">Abril 2026</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
          {user.iniciales}
        </div>
      </header>

      <BarraCotizaciones />

      <section className="mx-5 mb-5 rounded-xl bg-blue-50 p-4">
        <p className="mb-1 text-[11px] font-medium text-blue-900">
          DISPONIBLE POR MES · hasta dic
        </p>
        <p className="text-[28px] font-medium leading-tight text-blue-900">
          {formatARS(disponiblePorMes.ars)}
        </p>
        <p className="mt-0.5 text-xs text-blue-900/70">
          {formatUSD(disponiblePorMes.usd)} · {disponiblePorMes.mesesRestantes}{" "}
          meses restantes
        </p>
      </section>

      <div className="mx-5 mb-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="text-[10px] text-gray-500">SALDO TOTAL</div>
          <div className="mt-0.5 text-base font-medium">
            {formatARS(saldos.liquidoTotal.ars)}
          </div>
          <div className="text-[11px] text-gray-500">
            {formatUSD(saldos.liquidoTotal.usd)}
          </div>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="text-[10px] text-gray-500">A COBRAR</div>
          <div className="mt-0.5 text-base font-medium text-green-700">
            {formatARS(saldos.porCobrarTotal.ars, { showSign: true })}
          </div>
          <div className="text-[11px] text-gray-500">
            {formatUSD(saldos.porCobrarTotal.usd)}
          </div>
        </div>
      </div>

      <section className="mx-5 mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-gray-900">
            Gastos de abril
          </span>
          <span className="text-[11px] text-gray-500">
            {formatARS(gastosMesActual.total)} /{" "}
            {formatARS(gastosMesActual.presupuesto)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${progresoGastos}%` }}
          />
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {gastosMesActual.items.slice(0, 3).map((item) => (
            <div key={item.nombre} className="flex justify-between text-xs">
              <span className="text-gray-500">{item.nombre}</span>
              <span className="text-gray-900">{formatARS(item.monto)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
