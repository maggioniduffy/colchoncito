"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import {
  crearMovimientoParticular,
  editarMovimientoParticular,
} from "@/app/(app)/movimientos/actions";
import { toMesDB } from "@/lib/format";
import type {
  MovimientoParticular,
  TipoMovimiento,
  Moneda,
  Categoria,
} from "@/lib/types";

type Props = {
  movimiento?: MovimientoParticular | null;
  categorias: Categoria[];
  mesActual?: string;
  onClose: () => void;
};

export default function MovimientoModal({
  movimiento,
  categorias,
  mesActual,
  onClose,
}: Props) {
  const editando = !!movimiento;
  const cotizacionActual = useCotizacionStore((s) => s.getValorActivo());

  const [tipo, setTipo] = useState<TipoMovimiento>(
    movimiento?.tipo ?? "egreso",
  );
  const [nombre, setNombre] = useState(movimiento?.nombre ?? "");
  const [monto, setMonto] = useState(movimiento?.monto?.toString() ?? "");
  const [moneda, setMoneda] = useState<Moneda>(
    movimiento?.moneda_anclaje ?? "ARS",
  );
  const [categoriaId, setCategoriaId] = useState<number | null>(
    movimiento?.categoria_id ?? null,
  );
  const [fecha, setFecha] = useState<string>(
    movimiento?.fecha ?? new Date().toISOString().slice(0, 10),
  );
  const [notas, setNotas] = useState(movimiento?.notas ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresá un monto válido");
      return;
    }

    const input = {
      tipo,
      nombre: nombre.trim(),
      monto: montoNum,
      moneda_anclaje: moneda,
      cotizacion_usada: cotizacionActual,
      mes: mesActual ?? toMesDB(new Date(fecha)),
      fecha,
      categoria_id: categoriaId,
      notas: notas.trim() || null,
    };

    startTransition(async () => {
      const result = editando
        ? await editarMovimientoParticular(movimiento!.id, input)
        : await crearMovimientoParticular(input);
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
              {editando ? "Editar movimiento" : "Nuevo movimiento"}
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
              Egreso
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
              Ingreso
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                ¿EN QUÉ?
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={
                  tipo === "egreso"
                    ? "Carrefour, Uber, alquiler..."
                    : "Freelance, propina, venta..."
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

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                FECHA
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                NOTAS (opcional)
              </label>
              <input
                type="text"
                value={notas ?? ""}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Cumple de Juan, con tarjeta, etc."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

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
