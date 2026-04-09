"use client";

import { useRouter } from "next/navigation";
import MovimientoModal from "./movimiento-modal";
import type { Categoria } from "@/lib/types";

export default function NuevoMovimientoClient({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const router = useRouter();

  return (
    <MovimientoModal categorias={categorias} onClose={() => router.back()} />
  );
}
