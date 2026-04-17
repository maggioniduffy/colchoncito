"use client";

import { useState, useMemo } from "react";
import { useCotizacionStore } from "@/stores/cotizacion-store";
import { convertirMonto } from "@/lib/calculos/conversion";
import { fijosVigentesEnMes } from "@/lib/calculos/fijos-del-mes";
import { montoVigenteEnMes } from "@/lib/calculos/monto-vigente";
import { formatARS, formatUSD } from "@/lib/format";
import { borrarMovimientoParticular } from "@/app/(app)/movimientos/actions";
import { borrarFijo } from "@/app/(app)/fijos/actions";
import MovimientoModal from "./movimiento-modal";
import FijoModal from "./fijo-modal";
import ConfirmModal from "./confirm-modal";
import type {
  MovimientoParticular,
  MovimientoFijo,
  HistoricoMonto,
  Categoria,
} from "@/lib/types";

type ItemMes = {
  id: string; // "fijo-123" o "particular-456"
  origen: "fijo" | "particular";
  tipo: "ingreso" | "egreso";
  nombre: string;
  subtitulo: string;
  monto: number;
  monedaAnclaje: "ARS" | "USD";
  refFijo?: MovimientoFijo;
  refParticular?: MovimientoParticular;
};

// Arriba, en las props:
export default function MesDetalle({
  mesDB,
  movimientos,
  fijos,
  historicos,
  categorias,
}: {
  mesDB: string;
  movimientos: MovimientoParticular[];
  fijos: MovimientoFijo[];
  historicos: HistoricoMonto[];
  categorias: Categoria[];
}) {
  const cotizacion = useCotizacionStore((s) => s.getValorActivo());

  const [editandoParticular, setEditandoParticular] =
    useState<MovimientoParticular | null>(null);
  const [editandoFijo, setEditandoFijo] = useState<MovimientoFijo | null>(null);
  const [creandoParticular, setCreandoParticular] = useState(false);
  const [creandoFijo, setCreandoFijo] = useState(false);
  const [borrandoItem, setBorrandoItem] = useState<ItemMes | null>(null);

  const { ingresos, egresos, totalIngresos, totalEgresos } = useMemo(() => {
    const fijosVigentes = fijosVigentesEnMes(fijos, mesDB);

    const items: ItemMes[] = [];

    // Fijos que aplican a este mes
    for (const f of fijosVigentes) {
      const historicoFijo = historicos.filter(
        (h) => h.movimiento_fijo_id === f.id,
      );
      const monto = montoVigenteEnMes(mesDB, Number(f.monto), historicoFijo);

      items.push({
        id: `fijo-${f.id}`,
        origen: "fijo",
        tipo: f.tipo,
        nombre: f.nombre,
        subtitulo: `día ${f.dia_del_mes} · recurrente`,
        monto,
        monedaAnclaje: f.moneda_anclaje,
        refFijo: f,
      });
    }

    // Particulares del mes
    for (const m of movimientos) {
      items.push({
        id: `particular-${m.id}`,
        origen: "particular",
        tipo: m.tipo,
        nombre: m.nombre,
        subtitulo: m.notas ?? "particular de este mes",
        monto: Number(m.monto),
        monedaAnclaje: m.moneda_anclaje,
        refParticular: m,
      });
    }

    const ingresos = items.filter((i) => i.tipo === "ingreso");
    const egresos = items.filter((i) => i.tipo === "egreso");

    const sumar = (arr: ItemMes[]) =>
      arr.reduce((acc, item) => {
        const { ars } = convertirMonto(
          item.monto,
          item.monedaAnclaje,
          cotizacion,
        );
        return acc + ars;
      }, 0);

    return {
      ingresos,
      egresos,
      totalIngresos: sumar(ingresos),
      totalEgresos: sumar(egresos),
    };
  }, [fijos, historicos, movimientos, mesDB, cotizacion]);

  const balance = totalIngresos - totalEgresos;

  const handleEditar = (item: ItemMes) => {
    if (item.origen === "fijo" && item.refFijo) {
      setEditandoFijo(item.refFijo);
    } else if (item.origen === "particular" && item.refParticular) {
      setEditandoParticular(item.refParticular);
    }
  };

  const handleConfirmarBorrar = async () => {
    if (!borrandoItem) return;
    if (borrandoItem.origen === "fijo" && borrandoItem.refFijo) {
      await borrarFijo(borrandoItem.refFijo.id);
    } else if (
      borrandoItem.origen === "particular" &&
      borrandoItem.refParticular
    ) {
      await borrarMovimientoParticular(borrandoItem.refParticular.id);
    }
    setBorrandoItem(null);
  };

  const ingresosCount = ingresos.length;
  const egresosCount = egresos.length;

  const ingresosGrow = ingresosCount >= egresosCount;
  const egresosGrow = egresosCount > ingresosCount;

  return (
    <>
      <div className="mx-5 mb-4 grid grid-cols-2 gap-2 md:mx-0 md:gap-4">
        <div className="rounded-lg bg-emerald-500/10 p-2.5 md:p-4">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 md:text-xs">
            INGRESOS
          </div>
          <div className="mt-0.5 text-[15px] font-medium text-emerald-700 dark:text-emerald-400 md:text-2xl">
            {formatARS(totalIngresos)}
          </div>
        </div>
        <div className="rounded-lg bg-destructive/10 p-2.5 md:p-4">
          <div className="text-[10px] text-destructive md:text-xs">EGRESOS</div>
          <div className="mt-0.5 text-[15px] font-medium text-destructive md:text-2xl">
            {formatARS(totalEgresos)}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 max-h-[calc(100vh-400px)]">
        <div className={`${ingresosGrow ? "flex-1 min-h-0" : ""}`}>
          <Seccion
            titulo="INGRESOS"
            items={ingresos}
            cotizacion={cotizacion}
            onEditar={handleEditar}
            onBorrar={setBorrandoItem}
            onNuevoFijo={() => setCreandoFijo(true)}
            onNuevoParticular={() => setCreandoParticular(true)}
          />
        </div>

        <div className={`${egresosGrow ? "flex-1 min-h-0" : ""}`}>
          <Seccion
            titulo="EGRESOS"
            items={egresos}
            cotizacion={cotizacion}
            onEditar={handleEditar}
            onBorrar={setBorrandoItem}
            onNuevoFijo={() => setCreandoFijo(true)}
            onNuevoParticular={() => setCreandoParticular(true)}
          />
        </div>
      </div>

      <section className="mx-5 mb-4 rounded-lg bg-primary/10 p-3 md:mx-0 md:mt-6 md:p-5">
        <div className="flex justify-between text-sm text-primary md:text-base">
          <span>Balance del mes</span>
          <span className="font-medium">
            {formatARS(balance, { showSign: true })}
          </span>
        </div>
      </section>

      {creandoParticular && (
        <MovimientoModal
          categorias={categorias}
          mesActual={mesDB}
          onClose={() => setCreandoParticular(false)}
        />
      )}
      {editandoParticular && (
        <MovimientoModal
          movimiento={editandoParticular}
          categorias={categorias}
          mesActual={mesDB}
          onClose={() => setEditandoParticular(null)}
        />
      )}
      {creandoFijo && (
        <FijoModal
          categorias={categorias}
          onClose={() => setCreandoFijo(false)}
        />
      )}
      {editandoFijo && (
        <FijoModal
          fijo={editandoFijo}
          categorias={categorias}
          onClose={() => setEditandoFijo(null)}
        />
      )}
      {borrandoItem && (
        <ConfirmModal
          titulo={
            borrandoItem.origen === "fijo"
              ? "Borrar movimiento fijo"
              : "Borrar movimiento"
          }
          mensaje={
            borrandoItem.origen === "fijo"
              ? `Esto va a eliminar "${borrandoItem.nombre}" de todos los meses (pasados y futuros).`
              : `¿Borrar "${borrandoItem.nombre}"?`
          }
          textoConfirmar="Borrar"
          variante="destructive"
          onConfirmar={handleConfirmarBorrar}
          onCancelar={() => setBorrandoItem(null)}
        />
      )}
    </>
  );
}

function Seccion({
  titulo,
  items,
  cotizacion,
  onEditar,
  onBorrar,
  onNuevoFijo,
  onNuevoParticular,
}: {
  titulo: string;
  items: ItemMes[];
  cotizacion: number;
  onEditar: (item: ItemMes) => void;
  onBorrar: (item: ItemMes) => void;
  onNuevoFijo: () => void;
  onNuevoParticular: () => void;
}) {
  const fijos = items.filter((i) => i.origen === "fijo");
  const particulares = items.filter((i) => i.origen === "particular");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mx-5 mb-4 flex flex-col gap-1.5 md:mx-0">
        <span className="text-[11px] text-muted-foreground md:text-xs">
          {titulo}
        </span>
        <div className="flex gap-3">
          <button
            onClick={onNuevoFijo}
            className="text-[11px] text-primary md:text-xs"
          >
            + fijo
          </button>
          <button
            onClick={onNuevoParticular}
            className="text-[11px] text-primary md:text-xs"
          >
            + particular
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mx-5 mb-4 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground md:mx-0">
          Sin movimientos
        </div>
      ) : (
        <div className="mx-5 mb-4 flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 md:mx-0">
          {" "}
          {[...fijos, ...particulares].map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              cotizacion={cotizacion}
              onEditar={() => onEditar(item)}
              onBorrar={() => onBorrar(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  cotizacion,
  onEditar,
  onBorrar,
}: {
  item: ItemMes;
  cotizacion: number;
  onEditar: () => void;
  onBorrar: () => void;
}) {
  const { ars, usd } = convertirMonto(
    item.monto,
    item.monedaAnclaje,
    cotizacion,
  );

  const borderClass =
    item.origen === "fijo" ? "border-border" : "border-dashed border-border";

  return (
    <button
      onClick={onEditar}
      className={`group relative flex w-full cursor-pointer items-center justify-between rounded-lg border ${borderClass} px-3 py-2.5 text-left transition-colors hover:bg-muted/50 md:px-4 md:py-3.5`}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
        Editar
      </span>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium md:text-base">
            {item.nombre}
          </span>
          {item.origen === "fijo" && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              FIJO
            </span>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground md:text-xs">
          {item.subtitulo}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium md:text-base">
            {item.monedaAnclaje === "USD" ? formatUSD(usd) : formatARS(ars)}
          </div>
          <div className="text-[10px] text-muted-foreground md:text-xs">
            {item.monedaAnclaje === "USD" ? formatARS(ars) : formatUSD(usd)}
          </div>
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onBorrar();
          }}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-lg text-muted-foreground transition-opacity hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
        >
          ×
        </span>
      </div>
    </button>
  );
}
