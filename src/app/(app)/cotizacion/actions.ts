"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TipoCotizacion } from "@/lib/types";

export async function guardarCotizacionActiva(tipo: TipoCotizacion) {
  console.log("[action] guardando:", tipo);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[action] user:", user?.email);

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("usuario_config")
    .upsert(
      { user_id: user.id, cotizacion_activa: tipo },
      { onConflict: "user_id" },
    );

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
