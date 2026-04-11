import type { TipoCotizacion } from "@/lib/types";

export type CotizacionData = {
  tipo: TipoCotizacion;
  valorCompra: number;
  valorVenta: number;
  fetchedAt: Date;
};

// Mapeo de nuestros tipos al naming de DolarAPI
const DOLAR_API_ENDPOINTS: Record<Exclude<TipoCotizacion, "custom">, string> = {
  oficial: "https://dolarapi.com/v1/dolares/oficial",
  mep: "https://dolarapi.com/v1/dolares/bolsa",
  blue: "https://dolarapi.com/v1/dolares/blue",
  crypto: "https://dolarapi.com/v1/dolares/cripto",
};

type DolarApiResponse = {
  compra: number;
  venta: number;
  fechaActualizacion: string;
};

export async function fetchCotizacion(
  tipo: Exclude<TipoCotizacion, "custom">,
): Promise<CotizacionData> {
  const url = DOLAR_API_ENDPOINTS[tipo];
  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5min

  if (!res.ok) {
    throw new Error(`Error fetching ${tipo}: ${res.status}`);
  }

  const data: DolarApiResponse = await res.json();

  return {
    tipo,
    valorCompra: data.compra,
    valorVenta: data.venta,
    fetchedAt: new Date(data.fechaActualizacion),
  };
}

export async function fetchAllCotizaciones(): Promise<CotizacionData[]> {
  const tipos: Exclude<TipoCotizacion, "custom">[] = [
    "oficial",
    "mep",
    "blue",
    "crypto",
  ];

  const results = await Promise.allSettled(tipos.map(fetchCotizacion));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<CotizacionData> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value);
}
