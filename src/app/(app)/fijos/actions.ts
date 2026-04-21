"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  MovimientoFijo,
  MovimientoFijoInput,
  HistoricoMonto,
} from "@/lib/types";

export async function listarFijos() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("movimientos_fijos")
    .select("*")
    .eq("user_id", user.id)
    .order("activo", { ascending: false })
    .order("dia_del_mes", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as MovimientoFijo[] };
}

export async function listarHistoricoMontos(movimientoFijoId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("historico_montos_fijos")
    .select("*")
    .eq("movimiento_fijo_id", movimientoFijoId)
    .order("desde_mes", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as HistoricoMonto[] };
}

export async function listarHistoricosDeTodos(ids: number[]) {
  if (ids.length === 0) return { error: null, data: [] };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("historico_montos_fijos")
    .select("*")
    .in("movimiento_fijo_id", ids)
    .order("desde_mes", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as HistoricoMonto[] };
}

export async function crearFijo(input: MovimientoFijoInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("movimientos_fijos").insert({
    user_id: user.id,
    ...input,
    fecha_inicio: input.fecha_inicio ?? new Date().toLocaleDateString("en-CA"),
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

type EditarFijoOptions = {
  aplicarMontoDesde?:
    | "desde_mes_actual"
    | "corregir_desde_inicio"
    | "desde_mes";
  mesEspecifico?: string; // YYYY-MM-01, requerido si aplicarMontoDesde === "desde_mes"
};

export async function editarFijo(
  id: number,
  input: Partial<MovimientoFijoInput>,
  opciones?: EditarFijoOptions,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Si cambia el monto, manejar el histórico
  if (input.monto !== undefined && opciones?.aplicarMontoDesde) {
    if (opciones.aplicarMontoDesde === "corregir_desde_inicio") {
      // Borrar todo el histórico y actualizar el monto base
      await supabase
        .from("historico_montos_fijos")
        .delete()
        .eq("movimiento_fijo_id", id);
    } else {
      // Agregar entrada al histórico desde el mes correspondiente
      const mesDesde =
        opciones.aplicarMontoDesde === "desde_mes_actual"
          ? new Date().toISOString().slice(0, 7) + "-01"
          : opciones.mesEspecifico!;

      await supabase.from("historico_montos_fijos").upsert(
        {
          movimiento_fijo_id: id,
          desde_mes: mesDesde,
          monto: input.monto,
        },
        { onConflict: "movimiento_fijo_id,desde_mes" },
      );

      // Si no es "corregir desde inicio", no actualizamos el monto base
      // (queda como valor histórico anterior al cambio)
      delete input.monto;
    }
  }

  if (Object.keys(input).length > 0) {
    const { error } = await supabase
      .from("movimientos_fijos")
      .update(input)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function togglearFijoActivo(id: number, activo: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("movimientos_fijos")
    .update({ activo })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function borrarFijo(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("movimientos_fijos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
