"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CuentaInput } from "@/lib/types";

export async function listarCuentas() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("cuentas")
    .select("*")
    .eq("user_id", user.id)
    .order("tipo", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

export async function crearCuenta(input: CuentaInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("cuentas").insert({
    user_id: user.id,
    ...input,
  });

  if (error) return { error: error.message };

  revalidatePath("/cuentas");
  revalidatePath("/");
  return { success: true };
}

export async function editarCuenta(id: number, input: Partial<CuentaInput>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("cuentas")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cuentas");
  revalidatePath("/");
  return { success: true };
}

export async function borrarCuenta(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("cuentas")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cuentas");
  revalidatePath("/");
  return { success: true };
}
