import Link from "next/link";
import { listarAportes } from "../actions";
import {
  listarMovimientosDelAño,
  listarCategorias,
} from "@/app/(app)/movimientos/actions";
import {
  listarFijos,
  listarHistoricosDeTodos,
} from "@/app/(app)/fijos/actions";
import ReportesView from "@/components/app/reportes-view";

export default async function ReportesPage() {
  const año = new Date().getFullYear();

  const [
    { data: aportes },
    { data: movimientos },
    { data: categorias },
    { data: fijos },
  ] = await Promise.all([
    listarAportes(año),
    listarMovimientosDelAño(año),
    listarCategorias(),
    listarFijos(),
  ]);

  const fijosIds = (fijos ?? []).map((f) => f.id);
  const { data: historicos } = await listarHistoricosDeTodos(fijosIds);

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Link href="/presupuesto" className="text-primary">
            ←
          </Link>
          <p className="text-lg font-medium">Reportes</p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
          Anual {año}
        </span>
      </header>

      <ReportesView
        año={año}
        aportes={aportes ?? []}
        movimientos={movimientos ?? []}
        categorias={categorias ?? []}
        fijos={fijos ?? []}
        historicos={historicos ?? []}
      />
    </>
  );
}
