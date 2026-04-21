"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearFijo, editarFijo } from "@/app/(app)/fijos/actions";
import type {
  MovimientoFijo,
  TipoMovimiento,
  Moneda,
  TipoPlazo,
  Categoria,
} from "@/lib/types";

type Props = {
  fijo?: MovimientoFijo | null;
  categorias: Categoria[];
  onClose: () => void;
};

type AplicarDesde = "desde_mes_actual" | "corregir_desde_inicio";

export default function FijoModal({ fijo, categorias, onClose }: Props) {
  const editando = !!fijo;

  const [tipo, setTipo] = useState<TipoMovimiento>(fijo?.tipo ?? "egreso");
  const [nombre, setNombre] = useState(fijo?.nombre ?? "");
  const [monto, setMonto] = useState(fijo?.monto?.toString() ?? "");
  const [moneda, setMoneda] = useState<Moneda>(fijo?.moneda_anclaje ?? "ARS");
  const [diaDelMes, setDiaDelMes] = useState(
    fijo?.dia_del_mes?.toString() ?? "1",
  );
  const [categoriaId, setCategoriaId] = useState<number | null>(
    fijo?.categoria_id ?? null,
  );
  const [plazoTipo, setPlazoTipo] = useState<TipoPlazo>(
    fijo?.plazo_tipo ?? "indefinido",
  );
  const [plazoFechaFin, setPlazoFechaFin] = useState(
    fijo?.plazo_fecha_fin ?? "",
  );
  const [plazoRepeticiones, setPlazoRepeticiones] = useState(
    fijo?.plazo_repeticiones_restantes?.toString() ?? "",
  );
  const [aplicarDesde, setAplicarDesde] =
    useState<AplicarDesde>("desde_mes_actual");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [fechaInicio, setFechaInicio] = useState<string>(
    fijo?.fecha_inicio ?? new Date().toLocaleDateString("en-CA"),
  );

  const montoCambio = editando && parseFloat(monto) !== Number(fijo!.monto);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const montoNum = parseFloat(monto);
    const diaNum = parseInt(diaDelMes);

    if (isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresá un monto válido");
      return;
    }
    if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
      setError("El día del mes debe ser entre 1 y 31");
      return;
    }

    const input = {
      tipo,
      nombre: nombre.trim(),
      monto: montoNum,
      moneda_anclaje: moneda,
      dia_del_mes: diaNum,
      categoria_id: categoriaId,
      plazo_tipo: plazoTipo,
      plazo_fecha_fin: plazoTipo === "hasta_fecha" ? plazoFechaFin : null,
      plazo_repeticiones_restantes:
        plazoTipo === "n_repeticiones" ? parseInt(plazoRepeticiones) : null,
      fecha_inicio: fechaInicio, // ← agregá esto
    };

    startTransition(async () => {
      const result = editando
        ? await editarFijo(
            fijo!.id,
            input,
            montoCambio ? { aplicarMontoDesde: aplicarDesde } : undefined,
          )
        : await crearFijo(input);
      if (result.error) setError(result.error);
      else onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 md:items-center md:p-4"
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {editando ? "Editar movimiento fijo" : "Nuevo movimiento fijo"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg border border-border p-1">
            <button
              type="button"
              onClick={() => setTipo("egreso")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tipo === "egreso"
                  ? "bg-destructive text-destructive-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Egreso fijo
            </button>
            <button
              type="button"
              onClick={() => setTipo("ingreso")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tipo === "ingreso"
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Ingreso fijo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                NOMBRE
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={
                  tipo === "ingreso"
                    ? "Sueldo, alquiler cobrado..."
                    : "Alquiler, Netflix, gimnasio..."
                }
                required
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">
                  MONTO
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  MONEDA
                </label>
                <div className="flex gap-1">
                  {(["ARS", "USD"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMoneda(m)}
                      className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium ${
                        moneda === m
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {editando && montoCambio && (
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="mb-2 text-xs font-medium">
                  Cambiaste el monto. ¿Desde cuándo aplica?
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-start gap-2 text-xs">
                    <input
                      type="radio"
                      name="aplicar"
                      checked={aplicarDesde === "desde_mes_actual"}
                      onChange={() => setAplicarDesde("desde_mes_actual")}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-medium">
                        Desde este mes en adelante
                      </div>
                      <div className="text-muted-foreground">
                        Aumento real (paritaria, renegociación). No toca el
                        histórico.
                      </div>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-2 text-xs">
                    <input
                      type="radio"
                      name="aplicar"
                      checked={aplicarDesde === "corregir_desde_inicio"}
                      onChange={() => setAplicarDesde("corregir_desde_inicio")}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-medium">
                        Corregir desde el inicio
                      </div>
                      <div className="text-muted-foreground">
                        Fue un error de carga. Reescribe todos los meses
                        pasados.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                DÍA DEL MES
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={diaDelMes}
                onChange={(e) => setDiaDelMes(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                DESDE CUÁNDO APLICA
              </label>
              <input
                type="month"
                value={fechaInicio.slice(0, 7)}
                onChange={(e) => setFechaInicio(e.target.value + "-01")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                PLAZO
              </label>
              <div className="flex flex-col gap-1.5">
                {(
                  [
                    {
                      value: "indefinido",
                      label: "Indefinido",
                      desc: "Hasta que lo pares",
                    },
                    {
                      value: "hasta_fecha",
                      label: "Hasta una fecha",
                      desc: "Contrato con fecha de fin",
                    },
                    {
                      value: "n_repeticiones",
                      label: "N repeticiones",
                      desc: "Cuotas de un pago",
                    },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlazoTipo(p.value)}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left ${
                      plazoTipo === p.value
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        plazoTipo === p.value
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {plazoTipo === p.value && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`text-sm ${plazoTipo === p.value ? "font-medium text-primary" : ""}`}
                      >
                        {p.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {plazoTipo === "hasta_fecha" && (
                <input
                  type="date"
                  value={plazoFechaFin}
                  onChange={(e) => setPlazoFechaFin(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}

              {plazoTipo === "n_repeticiones" && (
                <input
                  type="number"
                  min="1"
                  value={plazoRepeticiones}
                  onChange={(e) => setPlazoRepeticiones(e.target.value)}
                  placeholder="Cantidad de cuotas"
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}
            </div>

            {categorias.length > 0 && (
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  CATEGORÍA
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setCategoriaId(categoriaId === cat.id ? null : cat.id)
                      }
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        categoriaId === cat.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Guardando..." : editando ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
