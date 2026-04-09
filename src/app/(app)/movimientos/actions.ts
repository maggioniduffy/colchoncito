"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  MovimientoParticular,
  MovimientoParticularInput,
  Categoria,
} from "@/lib/types";

export async function listarMovimientosDelMes(mesDB: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("movimientos_particulares")
    .select("*")
    .eq("user_id", user.id)
    .eq("mes", mesDB)
    .order("fecha", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as MovimientoParticular[] };
}

export async function listarMovimientosDelAño(año: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const desde = `${año}-01-01`;
  const hasta = `${año}-12-31`;

  const { data, error } = await supabase
    .from("movimientos_particulares")
    .select("*")
    .eq("user_id", user.id)
    .gte("mes", desde)
    .lte("mes", hasta)
    .order("mes", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as MovimientoParticular[] };
}

export async function listarCategorias() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("user_id", user.id)
    .order("orden", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as Categoria[] };
}

export async function crearMovimientoParticular(
  input: MovimientoParticularInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("movimientos_particulares").insert({
    user_id: user.id,
    ...input,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function editarMovimientoParticular(
  id: number,
  input: Partial<MovimientoParticularInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("movimientos_particulares")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function borrarMovimientoParticular(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("movimientos_particulares")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
