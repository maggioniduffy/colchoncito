"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearAporte, editarAporte } from "@/app/(app)/presupuesto/actions";
import type { PresupuestoAporte, Moneda, Categoria } from "@/lib/types";

type Props = {
  año: number;
  aporte?: PresupuestoAporte | null;
  categorias: Categoria[];
  onClose: () => void;
};

export default function AporteModal({
  año,
  aporte,
  categorias,
  onClose,
}: Props) {
  const editando = !!aporte;

  const [nombre, setNombre] = useState(aporte?.nombre ?? "");
  const [monto, setMonto] = useState(aporte?.monto?.toString() ?? "");
  const [moneda, setMoneda] = useState<Moneda>(aporte?.moneda ?? "ARS");
  const [categoriaId, setCategoriaId] = useState<number | null>(
    aporte?.categoria_id ?? null,
  );
  const [fechaAporte, setFechaAporte] = useState<string>(
    aporte?.fecha_aporte ?? new Date().toISOString().slice(0, 10),
  );
  const [notas, setNotas] = useState(aporte?.notas ?? "");
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
      año,
      nombre: nombre.trim(),
      monto: montoNum,
      moneda,
      categoria_id: categoriaId,
      fecha_aporte: fechaAporte,
      notas: notas.trim() || null,
    };

    startTransition(async () => {
      const result = editando
        ? await editarAporte(aporte!.id, input)
        : await crearAporte(input);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-card p-5 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {editando ? "Editar aporte" : `Nuevo aporte ${año}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-muted-foreground hover:text-foreground"
          >
            ×
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
              placeholder="Aguinaldo, colchón, venta moto..."
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
                CATEGORÍA (opcional)
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
              FECHA DEL APORTE
            </label>
            <input
              type="date"
              value={fechaAporte}
              onChange={(e) => setFechaAporte(e.target.value)}
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
              placeholder="Detalles del aporte"
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
  );
}
