"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const TEMAS = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
];

export default function MasPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hydration mismatch — el theme real solo se conoce en cliente
  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="mb-4 px-5 md:mb-6 md:px-0">
        <p className="text-lg font-medium md:text-2xl">Más</p>
      </header>

      <div className="mx-5 mb-6 md:mx-0">
        <p className="mb-2 text-[11px] text-muted-foreground md:text-xs">
          APARIENCIA
        </p>
        <div className="rounded-lg border border-border p-1">
          <div className="grid grid-cols-3 gap-1">
            {TEMAS.map((t) => {
              const activo = mounted && theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    activo
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-5 mb-6 md:mx-0">
        <p className="mb-2 text-[11px] text-muted-foreground md:text-xs">
          CUENTA
        </p>
        <form action="/logout" method="POST">
          <button
            type="submit"
            className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm hover:bg-muted"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="mx-5 mt-8 border-t border-border pt-6 md:mx-0">
        <p className="mb-3 text-xs text-muted-foreground">
          DESARROLLADO POR <b className="text-blue">@maggioniduffy</b>
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://maggioniduffy.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
          >
            <span>Portfolio</span>
            <span className="text-muted-foreground">→</span>
          </a>

          <a
            href="https://www.linkedin.com/in/maggioniduffy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
          >
            <span>LinkedIn</span>
            <span className="text-muted-foreground">→</span>
          </a>
        </div>
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Colchoncito · v2.1 · hecho en Argentina 🇦🇷
        </p>
      </div>
    </>
  );
}
