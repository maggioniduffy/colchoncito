import { listarAportes, obtenerConfigAnual } from "./actions";
import { listarCategorias } from "@/app/(app)/movimientos/actions";
import PresupuestoView from "@/components/app/presupuesto-view";
import Link from "next/link";

export default async function PresupuestoPage() {
  const año = new Date().getFullYear();

  const [{ data: aportes }, { data: categorias }, { data: config }] =
    await Promise.all([
      listarAportes(año),
      listarCategorias(),
      obtenerConfigAnual(año),
    ]);

  return (
    <>
      <PresupuestoView
        año={año}
        aportes={aportes ?? []}
        categorias={categorias ?? []}
        config={config!}
      />
    </>
  );
}
