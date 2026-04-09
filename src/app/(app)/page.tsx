import BarraCotizaciones from "@/components/app/barra-cotizaciones";
import { mockData } from "@/lib/mock-data";
import { formatARS, formatUSD } from "@/lib/format";
import { getUser, toDisplayUser } from "@/lib/supabase/get-user";

export default async function Dashboard() {
  const authUser = await getUser();
  const user = authUser
    ? toDisplayUser(authUser)
    : { nombre: "", iniciales: "" };
  const { disponiblePorMes, saldos, gastosMesActual } = mockData;
  const progresoGastos = Math.min(
    100,
    (gastosMesActual.total / gastosMesActual.presupuesto) * 100,
  );

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0">
        <div>
          <p className="text-sm text-muted-foreground">Hola, {user.nombre}</p>
          <p className="text-base font-medium md:text-2xl">Abril 2026</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary md:hidden">
          {user.iniciales}
        </div>
      </header>

      <div className="md:hidden">
        <BarraCotizaciones />
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <section className="mx-5 mb-5 rounded-xl bg-primary/10 p-4 md:col-span-2 md:mx-0 md:p-6">
          <p className="mb-1 text-[11px] font-medium text-primary">
            DISPONIBLE POR MES · hasta dic
          </p>
          <p className="text-[28px] font-medium leading-tight text-primary md:text-5xl">
            {formatARS(disponiblePorMes.ars)}
          </p>
          <p className="mt-0.5 text-xs text-primary/70 md:mt-2 md:text-sm">
            {formatUSD(disponiblePorMes.usd)} ·{" "}
            {disponiblePorMes.mesesRestantes} meses restantes
          </p>
        </section>

        <div className="hidden md:flex md:flex-col md:gap-3">
          <DesktopCotizaciones />
        </div>
      </div>

      <div className="mx-5 mb-4 grid grid-cols-2 gap-2.5 md:mx-0 md:mt-6 md:grid-cols-3 md:gap-4">
        <div className="rounded-lg bg-muted p-3 md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            SALDO TOTAL
          </div>
          <div className="mt-0.5 text-base font-medium md:text-xl">
            {formatARS(saldos.liquidoTotal.ars)}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            {formatUSD(saldos.liquidoTotal.usd)}
          </div>
        </div>
        <div className="rounded-lg bg-muted p-3 md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            A COBRAR
          </div>
          <div className="mt-0.5 text-base font-medium text-emerald-600 dark:text-emerald-400 md:text-xl">
            {formatARS(saldos.porCobrarTotal.ars, { showSign: true })}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            {formatUSD(saldos.porCobrarTotal.usd)}
          </div>
        </div>
        <div className="hidden rounded-lg bg-muted p-3 md:block md:p-4">
          <div className="text-[10px] text-muted-foreground md:text-xs">
            COMPROMETIDO
          </div>
          <div className="mt-0.5 text-base font-medium text-destructive md:text-xl">
            {formatARS(saldos.comprometidoTotal.ars)}
          </div>
          <div className="text-[11px] text-muted-foreground md:text-sm">
            {formatUSD(saldos.comprometidoTotal.usd)}
          </div>
        </div>
      </div>

      <section className="mx-5 mb-4 md:mx-0 md:mt-6 md:rounded-xl md:border md:border-border md:p-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium md:text-base">
            Gastos de abril
          </span>
          <span className="text-[11px] text-muted-foreground md:text-xs">
            {formatARS(gastosMesActual.total)} /{" "}
            {formatARS(gastosMesActual.presupuesto)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted md:h-2">
          <div
            className="h-full bg-primary"
            style={{ width: `${progresoGastos}%` }}
          />
        </div>
        <div className="mt-3 flex flex-col gap-1.5 md:mt-4 md:gap-2">
          {gastosMesActual.items.slice(0, 3).map((item) => (
            <div
              key={item.nombre}
              className="flex justify-between text-xs md:text-sm"
            >
              <span className="text-muted-foreground">{item.nombre}</span>
              <span>{formatARS(item.monto)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DesktopCotizaciones() {
  const { cotizaciones, cotizacionActiva } = mockData;
  const items: { key: keyof typeof cotizaciones; label: string }[] = [
    { key: "oficial", label: "Oficial" },
    { key: "mep", label: "MEP" },
    { key: "blue", label: "Blue" },
    { key: "crypto", label: "Crypto" },
  ];

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          COTIZACIONES
        </p>
        <a href="/cotizacion" className="text-xs text-primary">
          Cambiar →
        </a>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const activa = item.key === cotizacionActiva;
          const cot = cotizaciones[item.key];
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${
                activa ? "bg-primary/10" : ""
              }`}
            >
              <span
                className={`text-sm ${activa ? "font-medium text-primary" : "text-foreground"}`}
              >
                {item.label}
              </span>
              <span
                className={`text-sm ${activa ? "font-medium text-primary" : ""}`}
              >
                ${cot.valor.toLocaleString("es-AR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
