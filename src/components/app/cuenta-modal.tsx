"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearCuenta, editarCuenta } from "@/app/(app)/cuentas/actions";
import type { Cuenta, TipoCuenta, Moneda } from "@/lib/types";

const TIPOS: { value: TipoCuenta; label: string; desc: string }[] = [
  { value: "liquido", label: "Líquido", desc: "Plata disponible ya" },
  { value: "por_cobrar", label: "Por cobrar", desc: "Te van a pagar" },
  { value: "comprometido", label: "Comprometido", desc: "Ya debés pagarlo" },
];

export default function CuentaModal({
  cuenta,
  onClose,
}: {
  cuenta?: Cuenta | null;
  onClose: () => void;
}) {
  const editando = !!cuenta;
  const [nombre, setNombre] = useState(cuenta?.nombre ?? "");
  const [tipo, setTipo] = useState<TipoCuenta>(cuenta?.tipo ?? "liquido");
  const [moneda, setMoneda] = useState<Moneda>(cuenta?.moneda ?? "ARS");
  const [saldo, setSaldo] = useState(cuenta?.saldo_actual?.toString() ?? "");
  const [notas, setNotas] = useState(cuenta?.notas ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const saldoNum = parseFloat(saldo);
    if (isNaN(saldoNum)) {
      setError("Ingresá un saldo válido");
      return;
    }

    const input = {
      nombre: nombre.trim(),
      tipo,
      moneda,
      saldo_actual: tipo === "comprometido" ? -Math.abs(saldoNum) : saldoNum,
      notas: notas.trim() || null,
    };

    startTransition(async () => {
      const result = editando
        ? await editarCuenta(cuenta!.id, input)
        : await crearCuenta(input);

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
        className="w-full max-w-md rounded-t-2xl bg-card p-5 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {editando ? "Editar cuenta" : "Nueva cuenta"}
          </h2>
          <button
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
              placeholder="Mercado Pago, Efectivo USD, etc."
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              TIPO
            </label>
            <div className="flex flex-col gap-1.5">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                    tipo === t.value
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <div>
                    <div
                      className={
                        tipo === t.value ? "text-primary font-medium" : ""
                      }
                    >
                      {t.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.desc}
                    </div>
                  </div>
                  {tipo === t.value && <span className="text-primary">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                MONEDA
              </label>
              <div className="flex gap-1.5">
                {(["ARS", "USD"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMoneda(m)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                      moneda === m
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                SALDO {tipo === "comprometido" ? "(monto)" : ""}
              </label>
              <input
                type="number"
                step="0.01"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                placeholder="0"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              NOTAS (opcional)
            </label>
            <input
              type="text"
              value={notas ?? ""}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Vence 15/04, al entregar, etc."
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
