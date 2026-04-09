"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  PresupuestoAnual,
  PresupuestoConCategorias,
  Moneda,
} from "@/lib/types";
import type { PresupuestoAporte, PresupuestoAporteInput } from "@/lib/types";

export async function obtenerPresupuestoAnual(año: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data: presupuesto, error: errP } = await supabase
    .from("presupuestos_anuales")
    .select("*")
    .eq("user_id", user.id)
    .eq("año", año)
    .maybeSingle();

  if (errP) return { error: errP.message, data: null };
  if (!presupuesto) return { error: null, data: null };

  const { data: items, error: errI } = await supabase
    .from("presupuesto_categorias")
    .select("*, categoria:categorias(*)")
    .eq("presupuesto_id", presupuesto.id);

  if (errI) return { error: errI.message, data: null };

  return {
    error: null,
    data: {
      ...presupuesto,
      items: items ?? [],
    } as PresupuestoConCategorias,
  };
}

export async function crearPresupuestoAnual(input: {
  año: number;
  moneda: Moneda;
  total: number;
  categorias: { categoria_id: number; monto_anual: number }[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Crear el presupuesto anual
  const { data: presupuesto, error: errP } = await supabase
    .from("presupuestos_anuales")
    .insert({
      user_id: user.id,
      año: input.año,
      moneda: input.moneda,
      total: input.total,
    })
    .select()
    .single();

  if (errP || !presupuesto) {
    return { error: errP?.message ?? "Error creando presupuesto" };
  }

  // Crear las categorías del presupuesto
  if (input.categorias.length > 0) {
    const { error: errC } = await supabase
      .from("presupuesto_categorias")
      .insert(
        input.categorias.map((c) => ({
          presupuesto_id: presupuesto.id,
          categoria_id: c.categoria_id,
          monto_anual: c.monto_anual,
        })),
      );

    if (errC) return { error: errC.message };
  }

  revalidatePath("/presupuesto");
  revalidatePath("/presupuesto/reportes");
  return { success: true };
}

export async function actualizarPresupuestoAnual(
  presupuestoId: number,
  input: {
    total?: number;
    moneda?: Moneda;
    categorias?: { categoria_id: number; monto_anual: number }[];
  },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Actualizar el total/moneda si vienen
  if (input.total !== undefined || input.moneda !== undefined) {
    const updateData: Partial<PresupuestoAnual> = {};
    if (input.total !== undefined) updateData.total = input.total;
    if (input.moneda !== undefined) updateData.moneda = input.moneda;

    const { error } = await supabase
      .from("presupuestos_anuales")
      .update(updateData)
      .eq("id", presupuestoId)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
  }

  // Actualizar las categorías: borrar todas y reinsertar
  // (enfoque simple, es OK porque son pocas)
  if (input.categorias) {
    await supabase
      .from("presupuesto_categorias")
      .delete()
      .eq("presupuesto_id", presupuestoId);

    if (input.categorias.length > 0) {
      const { error } = await supabase.from("presupuesto_categorias").insert(
        input.categorias.map((c) => ({
          presupuesto_id: presupuestoId,
          categoria_id: c.categoria_id,
          monto_anual: c.monto_anual,
        })),
      );
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/presupuesto");
  revalidatePath("/presupuesto/reportes");
  return { success: true };
}

export async function borrarPresupuestoAnual(presupuestoId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("presupuestos_anuales")
    .delete()
    .eq("id", presupuestoId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/presupuesto");
  revalidatePath("/presupuesto/reportes");
  return { success: true };
}

export async function listarAportes(año: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado", data: null };

  const { data, error } = await supabase
    .from("presupuesto_aportes")
    .select("*")
    .eq("user_id", user.id)
    .eq("año", año)
    .order("fecha_aporte", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as PresupuestoAporte[] };
}

export async function crearAporte(input: PresupuestoAporteInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("presupuesto_aportes").insert({
    user_id: user.id,
    ...input,
    fecha_aporte: input.fecha_aporte ?? new Date().toISOString().slice(0, 10),
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function editarAporte(
  id: number,
  input: Partial<PresupuestoAporteInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("presupuesto_aportes")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function borrarAporte(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("presupuesto_aportes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
