import { create } from "zustand";
import type { TipoCotizacion } from "@/lib/types";
import type { CotizacionData } from "@/lib/cotizaciones/fetch";

type CotizacionStore = {
  cotizaciones: Record<string, CotizacionData>;
  activa: TipoCotizacion;
  setCotizaciones: (cots: CotizacionData[]) => void;
  setActiva: (tipo: TipoCotizacion) => void;
  getValorActivo: () => number;
};

export const useCotizacionStore = create<CotizacionStore>((set, get) => ({
  cotizaciones: {},
  activa: "mep",

  setCotizaciones: (cots) => {
    const dict: Record<string, CotizacionData> = {};
    for (const c of cots) dict[c.tipo] = c;
    set({ cotizaciones: dict });
  },

  setActiva: (tipo) => set({ activa: tipo }),

  getValorActivo: () => {
    const { cotizaciones, activa } = get();
    return cotizaciones[activa]?.valorVenta ?? 1;
  },
}));
