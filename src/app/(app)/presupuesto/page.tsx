import Link from "next/link";
import { listarAportes } from "./actions";
import { listarCategorias } from "@/app/(app)/movimientos/actions";
import PresupuestoView from "@/components/app/presupuesto-view";

export default async function PresupuestoPage() {
  const año = new Date().getFullYear();

  const [{ data: aportes }, { data: categorias }] = await Promise.all([
    listarAportes(año),
    listarCategorias(),
  ]);

  return (
    <>
      <header className="mb-0 flex items-center justify-end px-5 md:mb-4 md:px-0">
        <Link
          href="/presupuesto/reportes"
          className="text-xs font-medium text-primary md:text-sm"
        >
          Reportes →
        </Link>
      </header>

      <PresupuestoView
        año={año}
        aportes={aportes ?? []}
        categorias={categorias ?? []}
      />
    </>
  );
}
