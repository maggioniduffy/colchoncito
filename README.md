# Colchoncito — Pantallas iniciales

Estructura de archivos para dropear dentro de tu proyecto Next.js. Todas las pantallas usan datos mockeados de `lib/mock-data.ts` — cuando conectes Supabase, reemplazás las importaciones de mock por queries reales.

## Cómo usar

Copiá todo lo que hay en `src/` sobre el `src/` de tu proyecto Next. Respeta la estructura de `(app)` como route group — eso hace que el layout con bottom nav se comparta entre todas las pantallas autenticadas.

```
src/
├── lib/
│   ├── mock-data.ts          # Datos fake — reemplazar por queries Supabase
│   └── format.ts             # Formatters ARS/USD
├── components/app/
│   ├── barra-cotizaciones.tsx
│   └── bottom-nav.tsx
└── app/(app)/
    ├── layout.tsx            # Layout compartido (max-w phone + bottom nav)
    ├── page.tsx              # Dashboard — /
    ├── presupuesto/
    │   ├── page.tsx          # /presupuesto
    │   └── reportes/
    │       └── page.tsx      # /presupuesto/reportes
    ├── cuentas/
    │   └── page.tsx          # /cuentas
    ├── mes/[yyyymm]/
    │   └── page.tsx          # /mes/202604
    └── cotizacion/
        └── page.tsx          # /cotizacion (selector)
```

## Rutas disponibles

- `/` — Dashboard con hero "disponible por mes"
- `/presupuesto` — Vista anual del presupuesto
- `/presupuesto/reportes` — Gráficos de evolución y composición
- `/cuentas` — Cuentas agrupadas por tipo (líquido / por cobrar / comprometido)
- `/mes/202604` — Detalle de abril 2026 con ingresos fijos y particulares
- `/cotizacion` — Selector de cotización (oficial / MEP / blue / crypto)

## Dependencias

Todo lo que necesitás ya estaba en el snippet de setup que te pasé antes. La única que usa el código es `recharts` (en la pantalla de reportes), que ya instalaste.

## Qué falta

- La ruta `/nuevo` (botón + del bottom nav) — pendiente de diseñar pantalla de carga rápida
- La ruta `/mas` — menú de ajustes, logout, etc
- Conectar con Supabase (reemplazar mock por queries reales)
- Estado global con Zustand para `cotizacionActiva` (por ahora es parte del mock)

## Notas de diseño

- Mobile-first, wrapper `max-w-md` para que se vea decente en desktop
- Colores simples de Tailwind (gray/blue/green/red), sin design tokens custom por ahora
- Iconos inline SVG en el bottom nav — si querés algo más pulido, `lucide-react` es la recomendación
- Las conversiones ARS/USD en el mock están precalculadas; en producción vas a calcular `montoUsd` dinámicamente a partir del monto de anclaje × cotización activa
