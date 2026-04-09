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
