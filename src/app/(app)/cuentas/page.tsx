import { formatARS, formatUSD } from "@/lib/format";
import { TipoCuenta, mockData } from "@/lib/mock-data";

const GRUPOS: { tipo: TipoCuenta; titulo: string; colorTotal: string }[] = [
  {
    tipo: "liquido",
    titulo: "LÍQUIDO · disponible ya",
    colorTotal: "text-green-700",
  },
  { tipo: "por_cobrar", titulo: "POR COBRAR", colorTotal: "text-green-700" },
  { tipo: "comprometido", titulo: "COMPROMETIDO", colorTotal: "text-red-700" },
];

export default function CuentasPage() {
  const { cuentas } = mockData;

  return (
    <>
      <header className="mb-4 px-5">
        <p className="text-lg font-medium text-gray-900">Cuentas</p>
      </header>

      {GRUPOS.map((grupo) => {
        const items = cuentas.filter((c) => c.tipo === grupo.tipo);
        const totalArs = items.reduce((acc, c) => acc + c.saldoArs, 0);

        return (
          <section key={grupo.tipo} className="mx-5 mb-4">
            <div className="mb-1.5 flex justify-between text-[11px]">
              <span className="text-gray-500">{grupo.titulo}</span>
              <span className={`font-medium ${grupo.colorTotal}`}>
                {formatARS(totalArs, { showSign: grupo.tipo !== "liquido" })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map((cuenta) => (
                <div
                  key={cuenta.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {cuenta.nombre}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {cuenta.subtitulo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        cuenta.tipo === "comprometido"
                          ? "text-red-700"
                          : "text-gray-900"
                      }`}
                    >
                      {cuenta.moneda === "USD"
                        ? formatUSD(cuenta.saldoUsd)
                        : formatARS(cuenta.saldoArs)}
                    </div>
                    <div className="text-[10px] text-gray-500">
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
