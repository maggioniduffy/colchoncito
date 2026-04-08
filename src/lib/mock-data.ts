// Datos mock para desarrollo. Reemplazar por queries a Supabase cuando esté listo.

export type TipoCotizacion = "oficial" | "mep" | "blue" | "crypto";
export type TipoCuenta = "liquido" | "por_cobrar" | "comprometido";
export type MonedaAnclaje = "ARS" | "USD";

export const mockData = {
  user: { nombre: "Juan", iniciales: "JP" },

  cotizaciones: {
    oficial: {
      valor: 1087,
      actualizado: "hace 2 min",
      descripcion: "BCRA · venta",
    },
    mep: { valor: 1414, actualizado: "hace 2 min", descripcion: "AL30" },
    blue: {
      valor: 1445,
      actualizado: "hace 5 min",
      descripcion: "promedio informal",
    },
    crypto: {
      valor: 1422,
      actualizado: "hace 30 seg",
      descripcion: "USDT · Binance",
    },
  },

  cotizacionActiva: "mep" as TipoCotizacion,

  disponiblePorMes: {
    ars: 441875,
    usd: 312.5,
    mesesRestantes: 9,
  },

  saldos: {
    liquidoTotal: { ars: 1979600, usd: 1400 },
    porCobrarTotal: { ars: 1555400, usd: 1100 },
    comprometidoTotal: { ars: -164400, usd: -116 },
  },

  cuentas: [
    {
      id: 1,
      nombre: "Mercado Pago",
      tipo: "liquido" as TipoCuenta,
      moneda: "ARS" as MonedaAnclaje,
      saldoArs: 1131200,
      saldoUsd: 800,
      subtitulo: "ARS · cuenta",
    },
    {
      id: 2,
      nombre: "Efectivo USD",
      tipo: "liquido" as TipoCuenta,
      moneda: "USD" as MonedaAnclaje,
      saldoArs: 848400,
      saldoUsd: 600,
      subtitulo: "USD · cajón",
    },
    {
      id: 3,
      nombre: "Papá — lavarropas",
      tipo: "por_cobrar" as TipoCuenta,
      moneda: "USD" as MonedaAnclaje,
      saldoArs: 141400,
      saldoUsd: 100,
      subtitulo: "vence 15/04",
    },
    {
      id: 4,
      nombre: "KKApp — última etapa",
      tipo: "por_cobrar" as TipoCuenta,
      moneda: "USD" as MonedaAnclaje,
      saldoArs: 282800,
      saldoUsd: 200,
      subtitulo: "al entregar",
    },
    {
      id: 5,
      nombre: "Pendientes anual",
      tipo: "por_cobrar" as TipoCuenta,
      moneda: "USD" as MonedaAnclaje,
      saldoArs: 1131200,
      saldoUsd: 800,
      subtitulo: "6 cuotas restantes",
    },
    {
      id: 6,
      nombre: "Buquebus",
      tipo: "comprometido" as TipoCuenta,
      moneda: "ARS" as MonedaAnclaje,
      saldoArs: -164400,
      saldoUsd: -116,
      subtitulo: "viaje junio",
    },
  ],

  gastosMesActual: {
    total: 82000,
    presupuesto: 392777,
    items: [
      { nombre: "Apto médico", monto: 40000 },
      { nombre: "Lavarropas", monto: 20000 },
      { nombre: "Peluquería", monto: 20000 },
      { nombre: "Carrefour", monto: 2000 },
    ],
  },

  presupuestoAnual: {
    año: 2026,
    totalArs: 5302500,
    totalUsd: 3750,
    categorias: [
      {
        nombre: "Gastos fijos",
        anual: 2160000,
        mensual: "$180.000 / mes",
        porcentaje: 40.7,
        color: "#534AB7",
      },
      {
        nombre: "Variables (super, salidas)",
        anual: 1440000,
        mensual: "$120.000 / mes",
        porcentaje: 27.2,
        color: "#1D9E75",
      },
      {
        nombre: "Ahorro en USD",
        anual: 1272600,
        mensual: "USD 75 / mes",
        porcentaje: 24.0,
        color: "#D85A30",
      },
      {
        nombre: "Extras (Buquebus, etc)",
        anual: 429900,
        mensual: "eventos puntuales",
        porcentaje: 8.1,
        color: "#888780",
      },
    ],
  },

  mesDetalle: {
    yyyymm: "202604",
    nombre: "Abril 2026",
    ingresos: {
      total: 890000,
      fijos: [
        {
          id: 1,
          nombre: "Sueldo",
          subtitulo: "día 5 · todos los meses",
          montoArs: 750000,
          montoUsd: 530,
          monedaAnclaje: "ARS" as MonedaAnclaje,
        },
        {
          id: 2,
          nombre: "Alquiler depto",
          subtitulo: "día 10 · USD fijo",
          montoArs: 141400,
          montoUsd: 100,
          monedaAnclaje: "USD" as MonedaAnclaje,
        },
      ],
      particulares: [
        {
          id: 3,
          nombre: "Freelance — logo cliente X",
          subtitulo: "particular de abril",
          montoArs: 197960,
          montoUsd: 140,
          monedaAnclaje: "USD" as MonedaAnclaje,
        },
      ],
    },
    egresos: { total: 392777 },
    balance: 497223,
  },

  evolucionMensual: [
    { mes: "Ene", ingresos: 880000, egresos: 410000 },
    { mes: "Feb", ingresos: 895000, egresos: 385000 },
    { mes: "Mar", ingresos: 890000, egresos: 420000 },
    { mes: "Abr", ingresos: 890000, egresos: 392777 },
    { mes: "May", ingresos: 890000, egresos: 0 },
    { mes: "Jun", ingresos: 890000, egresos: 0 },
  ],
};
