"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function obtenerCierreMes(mesDB: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("cierre_mes")
    .select("*")
    .eq("user_id", user.id)
    .eq("mes", mesDB)
    .maybeSingle();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

export async function registrarCierreMes(
  mesDB: string,
  accion: "aporte" | "mes_siguiente" | "nada",
  monto: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Registrar que el mes fue resuelto
  const { error: errCierre } = await supabase.from("cierre_mes").insert({
    user_id: user.id,
    mes: mesDB,
    accion,
    monto,
  });

  if (errCierre) return { error: errCierre.message };

  const añoActual = new Date().getFullYear();
  const mesSiguienteDate = new Date(mesDB);
  mesSiguienteDate.setMonth(mesSiguienteDate.getMonth() + 1);
  const mesSiguienteDB =
    mesSiguienteDate.toLocaleDateString("en-CA").slice(0, 7) + "-01";

  if (accion === "aporte") {
    // Sumar al fondo anual como nuevo aporte
    const { error } = await supabase.from("presupuesto_aportes").insert({
      user_id: user.id,
      año: añoActual,
      nombre: `Sobrante de ${new Date(mesDB).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}`,
      monto,
      moneda: "ARS",
      fecha_aporte: new Date().toLocaleDateString("en-CA"),
      notas: "Generado automáticamente por cierre de mes",
    });
    if (error) return { error: error.message };
  }

  if (accion === "mes_siguiente") {
    // Crear ingreso particular en el mes siguiente
    const { error } = await supabase.from("movimientos_particulares").insert({
      user_id: user.id,
      tipo: "ingreso",
      nombre: `Sobrante de ${new Date(mesDB).toLocaleDateString("es-AR", { month: "long" })}`,
      monto,
      moneda_anclaje: "ARS",
      mes: mesSiguienteDB,
      fecha: mesSiguienteDB,
      notas: "Transferido del mes anterior",
    });
    if (error) return { error: error.message };
  }

  // Si es "nada", solo registramos el cierre y no hacemos nada más

  revalidatePath("/", "layout");
  return { success: true };
}
