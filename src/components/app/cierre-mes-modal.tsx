"use client";

import { useState, useTransition } from "react";
import { registrarCierreMes, deshacerCierreMes } from "@/app/(app)/cierre/actions";
import { formatARS } from "@/lib/format";

type Accion = "aporte" | "mes_siguiente" | "nada";

const OPCIONES: {
  value: Accion;
  label: string;
  desc: string;
  icono: string;
}[] = [
  {
    value: "aporte",
    label: "Sumarlo al presupuesto general",
    desc: "Se agrega como un nuevo aporte al presupuesto anual del año y aumenta la base mensual.",
    icono: "📊",
  },
  {
    value: "mes_siguiente",
    label: "Sumarlo al mes que viene",
    desc: "Se agrega como ingreso extraordinario del mes entrante. Solo afecta a ese mes.",
    icono: "📅",
  },
  {
    value: "nada",
    label: "No hacer nada",
    desc: "El sobrante queda registrado pero no se mueve a ningún lado.",
    icono: "✋",
  },
];

export default function CierreMesModal({
  mesDB,
  sobrante,
  nombreMes,
  accionExistente,
  onClose,
}: {
  mesDB: string;
  sobrante: number;
  nombreMes: string;
  accionExistente?: Accion | null;
  onClose: () => void;
}) {
  const [seleccion, setSeleccion] = useState<Accion | null>(
    accionExistente ?? "aporte",
  );
  const [monto, setMonto] = useState<string>(sobrante.toString());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirmar = () => {
    if (!seleccion) return;
    setError(null);

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum < 0) {
      setError("Ingresá un monto válido");
      return;
    }

    startTransition(async () => {
      const result = await registrarCierreMes(mesDB, seleccion, montoNum);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  const handleDeshacer = () => {
    setError(null);
    startTransition(async () => {
      const result = await deshacerCierreMes(mesDB);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-card md:max-h-[85vh] md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 md:hidden">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-1 text-center text-2xl">🎉</div>
          <h2 className="text-center text-lg font-medium">
            Remanente de {nombreMes}
          </h2>
          <p className="mt-1 text-center text-2xl font-medium text-emerald-600 dark:text-emerald-400">
            {formatARS(sobrante)}
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Elegí dónde querés transferir o sumar este remanente
          </p>

          <div className="mt-4">
            <label className="mb-1 block text-xs text-muted-foreground">
              MONTO A MOVER
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-7 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {OPCIONES.map((op) => (
              <button
                key={op.value}
                type="button"
                onClick={() => setSeleccion(op.value)}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  seleccion === op.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="mt-0.5 text-xl">{op.icono}</span>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      seleccion === op.value ? "text-primary" : ""
                    }`}
                  >
                    {op.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {op.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-2">
            {accionExistente ? (
              <button
                type="button"
                onClick={handleDeshacer}
                disabled={isPending}
                className="rounded-lg border border-destructive/30 px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-40"
              >
                Deshacer cierre
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={!seleccion || isPending}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              {isPending ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
