"use client";

import { useState, useTransition, useMemo, type FormEvent } from "react";
import {
  crearPresupuestoAnual,
  actualizarPresupuestoAnual,
} from "@/app/(app)/presupuesto/actions";
import { formatARS } from "@/lib/format";
import type { PresupuestoConCategorias, Categoria, Moneda } from "@/lib/types";

type Props = {
  año: number;
  categorias: Categoria[];
  presupuesto?: PresupuestoConCategorias | null;
  onClose: () => void;
};

export default function PresupuestoModal({
  año,
  categorias,
  presupuesto,
  onClose,
}: Props) {
  const editando = !!presupuesto;

  const [total, setTotal] = useState(presupuesto?.total?.toString() ?? "");
  const [moneda, setMoneda] = useState<Moneda>(presupuesto?.moneda ?? "ARS");

  // Estado de distribución: categoria_id → monto
  const [distribucion, setDistribucion] = useState<Record<number, string>>(
    () => {
      const inicial: Record<number, string> = {};
      if (presupuesto) {
        for (const item of presupuesto.items) {
          inicial[item.categoria_id] = item.monto_anual.toString();
        }
      }
      return inicial;
    },
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalNum = parseFloat(total) || 0;

  const sumaDistribuido = useMemo(() => {
    return Object.values(distribucion).reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0,
    );
  }, [distribucion]);

  const restante = totalNum - sumaDistribuido;

  const handleDistribuirParejo = () => {
    if (categorias.length === 0 || totalNum <= 0) return;
    const porCategoria = totalNum / categorias.length;
    const nueva: Record<number, string> = {};
    for (const cat of categorias) {
      nueva[cat.id] = porCategoria.toFixed(0);
    }
    setDistribucion(nueva);
  };

  const handleChangeCategoria = (catId: number, valor: string) => {
    setDistribucion((prev) => ({ ...prev, [catId]: valor }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (totalNum <= 0) {
      setError("El total debe ser mayor a 0");
      return;
    }

    // Filtrar solo las categorías con monto > 0
    const categoriasValidas = Object.entries(distribucion)
      .map(([catId, valor]) => ({
        categoria_id: parseInt(catId),
        monto_anual: parseFloat(valor) || 0,
      }))
      .filter((c) => c.monto_anual > 0);

    const input = {
      año,
      moneda,
      total: totalNum,
      categorias: categoriasValidas,
    };

    startTransition(async () => {
      const result = editando
        ? await actualizarPresupuestoAnual(presupuesto!.id, input)
        : await crearPresupuestoAnual(input);

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
            {editando ? `Editar presupuesto ${año}` : `Presupuesto ${año}`}
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
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                TOTAL ANUAL
              </label>
              <input
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
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

          {totalNum > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-muted p-2.5 text-xs">
              <span className="text-muted-foreground">Por distribuir:</span>
              <span
                className={`font-medium ${
                  restante < 0
                    ? "text-destructive"
                    : restante === 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                }`}
              >
                {formatARS(restante)}
              </span>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-muted-foreground">
                DISTRIBUCIÓN POR CATEGORÍA
              </label>
              {totalNum > 0 && (
                <button
                  type="button"
                  onClick={handleDistribuirParejo}
                  className="text-[11px] text-primary"
                >
                  Repartir parejo
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 text-sm">{cat.nombre}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={distribucion[cat.id] ?? ""}
                    onChange={(e) =>
                      handleChangeCategoria(cat.id, e.target.value)
                    }
                    placeholder="0"
                    className="w-28 rounded-md border border-border bg-background px-2 py-1 text-right text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
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
