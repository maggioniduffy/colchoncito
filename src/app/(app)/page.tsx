import { BarraCotizaciones } from "@/components/app/barra-cotizaciones";
import DashboardStats from "@/components/app/dashboard-stats";
import GastosDelMes from "@/components/app/gastos-del-mes";
import { getUser, toDisplayUser } from "@/lib/supabase/get-user";
import {
  listarMovimientosDelMes,
  listarMovimientosDelAño,
} from "./movimientos/actions";
import { listarFijos, listarHistoricosDeTodos } from "./fijos/actions";
import { listarAportes } from "./presupuesto/actions";
import { toMesDB } from "@/lib/format";

export default async function Dashboard() {
  const authUser = await getUser();
  const user = authUser
    ? toDisplayUser(authUser)
    : { nombre: "", iniciales: "" };

  const mesActual = toMesDB();
  const añoActual = new Date().getFullYear();

  const [
    { data: movimientosMes },
    { data: movimientosAño },
    { data: fijos },
    { data: aportes },
  ] = await Promise.all([
    listarMovimientosDelMes(mesActual),
    listarMovimientosDelAño(añoActual),
    listarFijos(),
    listarAportes(añoActual),
  ]);

  const fijosIds = (fijos ?? []).map((f) => f.id);
  const { data: historicos } = await listarHistoricosDeTodos(fijosIds);

  return (
    <>
      <header className="mb-4 flex items-center justify-between px-5 md:mb-6 md:px-0">
        <div>
          <p className="text-sm text-muted-foreground">Hola, {user.nombre}</p>
          <p className="text-base font-medium capitalize md:text-2xl">
            {new Date().toLocaleDateString("es-AR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary md:hidden">
          {user.iniciales}
        </div>
      </header>

      <div className="md:hidden">
        <BarraCotizaciones />
      </div>

      <DashboardStats
        aportes={aportes ?? []}
        fijos={fijos ?? []}
        historicos={historicos ?? []}
        movimientosDelAño={movimientosAño ?? []}
      />

      <GastosDelMes movimientos={movimientosMes ?? []} />
    </>
  );
}
