export type TipoCuenta = "liquido" | "por_cobrar" | "comprometido";
export type Moneda = "ARS" | "USD";

export type Cuenta = {
  id: number;
  user_id: string;
  nombre: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldo_actual: number;
  vencimiento: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type CuentaInput = {
  nombre: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldo_actual: number;
  vencimiento?: string | null;
  notas?: string | null;
};

export type TipoMovimiento = "ingreso" | "egreso";

export type MovimientoParticular = {
  id: number;
  user_id: string;
  tipo: TipoMovimiento;
  nombre: string;
  monto: number;
  moneda_anclaje: Moneda;
  cotizacion_usada: number | null;
  mes: string; // YYYY-MM-01
  fecha: string | null;
  cuenta_id: number | null;
  categoria_id: number | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type MovimientoParticularInput = {
  tipo: TipoMovimiento;
  nombre: string;
  monto: number;
  moneda_anclaje: Moneda;
  cotizacion_usada?: number | null;
  mes: string;
  fecha?: string | null;
  cuenta_id?: number | null;
  categoria_id?: number | null;
  notas?: string | null;
};

export type Categoria = {
  id: number;
  user_id: string;
  nombre: string;
  color: string;
  icono: string | null;
  es_default: boolean;
  orden: number;
};

export type TipoPlazo = "indefinido" | "hasta_fecha" | "n_repeticiones";

export type MovimientoFijo = {
  id: number;
  user_id: string;
  tipo: TipoMovimiento;
  nombre: string;
  monto: number;
  moneda_anclaje: Moneda;
  dia_del_mes: number;
  cuenta_id: number | null;
  categoria_id: number | null;
  plazo_tipo: TipoPlazo;
  plazo_fecha_fin: string | null;
  plazo_repeticiones_restantes: number | null;
  fecha_inicio: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type MovimientoFijoInput = {
  tipo: TipoMovimiento;
  nombre: string;
  monto: number;
  moneda_anclaje: Moneda;
  dia_del_mes: number;
  cuenta_id?: number | null;
  categoria_id?: number | null;
  plazo_tipo: TipoPlazo;
  plazo_fecha_fin?: string | null;
  plazo_repeticiones_restantes?: number | null;
  fecha_inicio?: string;
};

export type HistoricoMonto = {
  id: number;
  movimiento_fijo_id: number;
  desde_mes: string; // YYYY-MM-01
  monto: number;
  created_at: string;
};

export type PresupuestoAnual = {
  id: number;
  user_id: string;
  año: number;
  moneda: Moneda;
  total: number;
  created_at: string;
  updated_at: string;
};

export type PresupuestoCategoria = {
  id: number;
  presupuesto_id: number;
  categoria_id: number;
  monto_anual: number;
  created_at: string;
};

// Tipo combinado útil para pintar la pantalla
export type PresupuestoConCategorias = PresupuestoAnual & {
  items: (PresupuestoCategoria & { categoria: Categoria })[];
};

export type PresupuestoAporte = {
  id: number;
  user_id: string;
  año: number;
  nombre: string;
  monto: number;
  moneda: Moneda;
  categoria_id: number | null;
  fecha_aporte: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type PresupuestoAporteInput = {
  año: number;
  nombre: string;
  monto: number;
  moneda: Moneda;
  categoria_id?: number | null;
  fecha_aporte?: string;
  notas?: string | null;
};

export type PresupuestoConfigAnual = {
  user_id: string;
  año: number;
  meses_division: number;
  desde_mes: number;
};

export type TipoCotizacion = "oficial" | "mep" | "blue" | "crypto" | "custom";
