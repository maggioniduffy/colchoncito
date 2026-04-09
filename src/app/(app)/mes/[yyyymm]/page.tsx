import { mockData } from "@/lib/mock-data";
import { formatARS, formatUSD } from "@/lib/format";

export default function MesPage({ params }: { params: { yyyymm: string } }) {
  const { mesDetalle } = mockData;

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0">
        <div>
          <p className="text-[11px] text-muted-foreground md:text-xs">MES</p>
          <p className="text-lg font-medium md:text-2xl">
            ◀ {mesDetalle.nombre} ▶
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground md:text-xs">
          MEP · $1.414
        </span>
      </header>

      <div className="mx-5 mb-4 grid grid-cols-2 gap-2 md:mx-0 md:gap-4">
        <div className="rounded-lg bg-emerald-500/10 p-2.5 md:p-4">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 md:text-xs">
            INGRESOS
          </div>
          <div className="mt-0.5 text-[15px] font-medium text-emerald-700 dark:text-emerald-400 md:text-2xl">
            {formatARS(mesDetalle.ingresos.total)}
          </div>
        </div>
        <div className="rounded-lg bg-destructive/10 p-2.5 md:p-4">
          <div className="text-[10px] text-destructive md:text-xs">EGRESOS</div>
          <div className="mt-0.5 text-[15px] font-medium text-destructive md:text-2xl">
            {formatARS(mesDetalle.egresos.total)}
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div>
          <div className="mx-5 mb-2 flex items-center justify-between md:mx-0">
            <span className="text-[11px] text-muted-foreground md:text-xs">
              INGRESOS FIJOS · recurrentes
            </span>
            <button className="text-[11px] text-primary md:text-xs">
              + agregar
            </button>
          </div>

          <div className="mx-5 mb-4 flex flex-col gap-1.5 md:mx-0">
            {mesDetalle.ingresos.fijos.map((item) => (
              <MovimientoRow key={item.id} item={item} punteado={false} />
            ))}
          </div>

          <div className="mx-5 mb-2 flex items-center justify-between md:mx-0">
            <span className="text-[11px] text-muted-foreground md:text-xs">
              SOLO ESTE MES
            </span>
            <button className="text-[11px] text-primary md:text-xs">
              + agregar
            </button>
          </div>

          <div className="mx-5 mb-5 flex flex-col gap-1.5 md:mx-0">
            {mesDetalle.ingresos.particulares.map((item) => (
              <MovimientoRow key={item.id} item={item} punteado />
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              EGRESOS DEL MES
            </span>
            <button className="text-xs text-primary">+ agregar</button>
          </div>
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            (lista de egresos del mes)
          </div>
        </div>
      </div>

      <section className="mx-5 mb-4 rounded-lg bg-primary/10 p-3 md:mx-0 md:mt-6 md:p-5">
        <div className="flex justify-between text-xs text-primary md:text-base">
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
      className={`flex items-center justify-between rounded-lg px-3 py-2.5 md:px-4 md:py-3.5 ${
        punteado ? "border border-dashed border-border" : "border border-border"
      }`}
    >
      <div>
        <div className="text-sm font-medium md:text-base">{item.nombre}</div>
        <div className="text-[11px] text-muted-foreground md:text-xs">
          {item.subtitulo}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium md:text-base">
          {item.monedaAnclaje === "USD"
            ? formatUSD(item.montoUsd)
            : formatARS(item.montoArs)}
        </div>
        <div className="text-[10px] text-muted-foreground md:text-xs">
          {item.monedaAnclaje === "USD"
            ? formatARS(item.montoArs)
            : formatUSD(item.montoUsd)}
        </div>
      </div>
    </div>
  );
}
