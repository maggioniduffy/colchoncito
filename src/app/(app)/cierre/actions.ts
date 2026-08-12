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

  // Parsear año y mes sin desfase de zona horaria
  const [yearStr, monthStr] = mesDB.split("-");
  const añoMes = parseInt(yearStr, 10);
  const mesNum = parseInt(monthStr, 10);

  const fechaObjeto = new Date(añoMes, mesNum - 1, 1);
  const nombreMesExtenso = fechaObjeto.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  const nombreMesSolo = fechaObjeto.toLocaleDateString("es-AR", {
    month: "long",
  });

  const tagNotaAporte = `Generado automáticamente por cierre de mes (${mesDB})`;
  const tagNotaIngreso = `Transferido del mes anterior (${mesDB})`;

  // Limpiar aportes e ingresos previos generados por este cierre de mes
  await supabase
    .from("presupuesto_aportes")
    .delete()
    .eq("user_id", user.id)
    .eq("notas", tagNotaAporte);

  await supabase
    .from("movimientos_particulares")
    .delete()
    .eq("user_id", user.id)
    .eq("notas", tagNotaIngreso);

  // Registrar / actualizar el cierre en la tabla cierre_mes
  const { error: errCierre } = await supabase.from("cierre_mes").upsert(
    {
      user_id: user.id,
      mes: mesDB,
      accion,
      monto,
    },
    { onConflict: "user_id,mes" },
  );

  if (errCierre) return { error: errCierre.message };

  // Calcular el mes siguiente
  let nextYear = añoMes;
  let nextMonth = mesNum + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  const mesSiguienteDB = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  if (accion === "aporte") {
    // Sumar al fondo del presupuesto anual como un nuevo aporte
    const { error } = await supabase.from("presupuesto_aportes").insert({
      user_id: user.id,
      año: añoMes,
      nombre: `Sobrante de ${nombreMesExtenso}`,
      monto,
      moneda: "ARS",
      fecha_aporte: new Date().toLocaleDateString("en-CA"),
      notas: tagNotaAporte,
    });
    if (error) return { error: error.message };
  }

  if (accion === "mes_siguiente") {
    // Crear un ingreso particular en el mes siguiente
    const { error } = await supabase.from("movimientos_particulares").insert({
      user_id: user.id,
      tipo: "ingreso",
      nombre: `Sobrante de ${nombreMesSolo}`,
      monto,
      moneda_anclaje: "ARS",
      mes: mesSiguienteDB,
      fecha: mesSiguienteDB,
      notas: tagNotaIngreso,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deshacerCierreMes(mesDB: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const tagNotaAporte = `Generado automáticamente por cierre de mes (${mesDB})`;
  const tagNotaIngreso = `Transferido del mes anterior (${mesDB})`;

  await supabase
    .from("presupuesto_aportes")
    .delete()
    .eq("user_id", user.id)
    .eq("notas", tagNotaAporte);

  await supabase
    .from("movimientos_particulares")
    .delete()
    .eq("user_id", user.id)
    .eq("notas", tagNotaIngreso);

  const { error } = await supabase
    .from("cierre_mes")
    .delete()
    .eq("user_id", user.id)
    .eq("mes", mesDB);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
