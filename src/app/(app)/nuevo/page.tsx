import { redirect } from "next/navigation";
import NuevoMovimientoClient from "@/components/app/nuevo-movimiento-client";
import { listarCategorias } from "@/app/(app)/movimientos/actions";

export default async function NuevoPage() {
  const { data: categorias } = await listarCategorias();

  if (!categorias) {
    redirect("/");
  }

  return <NuevoMovimientoClient categorias={categorias} />;
}
