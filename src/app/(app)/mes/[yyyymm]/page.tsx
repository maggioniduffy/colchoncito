import Link from "next/link";
import {
  listarMovimientosDelMes,
  listarCategorias,
} from "@/app/(app)/movimientos/actions";
import {
  listarFijos,
  listarHistoricosDeTodos,
} from "@/app/(app)/fijos/actions";
import { mesDBaLabel } from "@/lib/format";
import MesDetalle from "@/components/app/mes-detalle";
import {
  listarAportes,
  obtenerConfigAnual,
} from "@/app/(app)/presupuesto/actions";
import PresupuestoDelMes from "@/components/app/presupuest-del-mes";

export default async function MesPage({
  params,
}: {
  params: Promise<{ yyyymm: string }>;
}) {
  const { yyyymm } = await params;
  const year = yyyymm.slice(0, 4);
  const yearInt = parseInt(year);
  const mes = yyyymm.slice(4, 6);
  const mesDB = `${year}-${mes}-01`;

  const [
    { data: movimientos },
    { data: categorias },
    { data: fijos },
    { data: aportes },
    { data: config },
  ] = await Promise.all([
    listarMovimientosDelMes(mesDB),
    listarCategorias(),
    listarFijos(),
    listarAportes(yearInt),
    obtenerConfigAnual(yearInt),
  ]);

  const fijosIds = (fijos ?? []).map((f) => f.id);
  const { data: historicos } = await listarHistoricosDeTodos(fijosIds);

  const fechaMes = new Date(yearInt, parseInt(mes) - 1, 1);
  const anterior = new Date(fechaMes);
  anterior.setMonth(anterior.getMonth() - 1);
  const siguiente = new Date(fechaMes);
  siguiente.setMonth(siguiente.getMonth() + 1);

  const toYyyymm = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0 ">
        <div className="flex items-center gap-3">
          <Link
            href={`/mes/${toYyyymm(anterior)}`}
            className="text-primary hover:opacity-70"
          >
            ◀
          </Link>
          <div>
            <p className="text-[11px] text-muted-foreground md:text-xs">MES</p>
            <p className="text-lg font-medium capitalize md:text-2xl">
              {mesDBaLabel(mesDB)}
            </p>
          </div>
          <Link
            href={`/mes/${toYyyymm(siguiente)}`}
            className="text-primary hover:opacity-70"
          >
            ▶
          </Link>
        </div>
      </header>

      <PresupuestoDelMes
        mesDB={mesDB}
        aportes={aportes ?? []}
        config={config!}
        movimientos={movimientos ?? []}
      />

      <MesDetalle
        mesDB={mesDB}
        movimientos={movimientos ?? []}
        fijos={fijos ?? []}
        historicos={historicos ?? []}
        categorias={categorias ?? []}
      />
    </>
  );
}
