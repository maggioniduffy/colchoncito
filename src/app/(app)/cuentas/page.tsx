import { mockData, type TipoCuenta } from "@/lib/mock-data";
import { formatARS, formatUSD } from "@/lib/format";

const GRUPOS: { tipo: TipoCuenta; titulo: string; colorTotal: string }[] = [
  {
    tipo: "liquido",
    titulo: "LÍQUIDO · disponible ya",
    colorTotal: "text-emerald-600 dark:text-emerald-400",
  },
  {
    tipo: "por_cobrar",
    titulo: "POR COBRAR",
    colorTotal: "text-emerald-600 dark:text-emerald-400",
  },
  {
    tipo: "comprometido",
    titulo: "COMPROMETIDO",
    colorTotal: "text-destructive",
  },
];

export default function CuentasPage() {
  const { cuentas } = mockData;

  return (
    <>
      <header className="mb-4 px-5 md:mb-6 md:px-0">
        <p className="text-lg font-medium md:text-2xl">Cuentas</p>
      </header>

      {GRUPOS.map((grupo) => {
        const items = cuentas.filter((c) => c.tipo === grupo.tipo);
        const totalArs = items.reduce((acc, c) => acc + c.saldoArs, 0);

        return (
          <section key={grupo.tipo} className="mx-5 mb-4 md:mx-0 md:mb-6">
            <div className="mb-1.5 flex justify-between text-[11px] md:mb-2 md:text-xs">
              <span className="text-muted-foreground">{grupo.titulo}</span>
              <span className={`font-medium ${grupo.colorTotal}`}>
                {formatARS(totalArs, { showSign: grupo.tipo !== "liquido" })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
              {items.map((cuenta) => (
                <div
                  key={cuenta.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 md:px-4 md:py-3.5"
                >
                  <div>
                    <div className="text-sm font-medium md:text-base">
                      {cuenta.nombre}
                    </div>
                    <div className="text-[11px] text-muted-foreground md:text-xs">
                      {cuenta.subtitulo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium md:text-base ${
                        cuenta.tipo === "comprometido" ? "text-destructive" : ""
                      }`}
                    >
                      {cuenta.moneda === "USD"
                        ? formatUSD(cuenta.saldoUsd)
                        : formatARS(cuenta.saldoArs)}
                    </div>
                    <div className="text-[10px] text-muted-foreground md:text-xs">
                      {cuenta.moneda === "USD"
                        ? formatARS(cuenta.saldoArs)
                        : formatUSD(cuenta.saldoUsd)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
