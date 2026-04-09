import { listarCuentas } from "./actions";
import CuentasList from "@/components/app/cuentas-list";

export default async function CuentasPage() {
  const { data: cuentas, error } = await listarCuentas();

  if (error) {
    return (
      <div className="mx-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive md:mx-0">
        Error cargando cuentas: {error}
      </div>
    );
  }

  return <CuentasList cuentas={cuentas ?? []} />;
}
