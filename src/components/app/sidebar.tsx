import Link from "next/link";
import Image from "next/image";
import { getUser, toDisplayUser } from "@/lib/supabase/get-user";
import SidebarNav from "./sidebar-nav";

export default async function Sidebar() {
  const user = await getUser();
  const display = user ? toDisplayUser(user) : null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <Image
          src="/favicon-32x32.png"
          alt="Colchoncito"
          width={32}
          height={32}
        />
        <span className="text-base font-medium">Colchoncito</span>
      </div>

      <SidebarNav />

      <Link
        href="/nuevo"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <span className="text-lg leading-none">+</span>
        <span>Nuevo movimiento</span>
      </Link>

      {display && (
        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-center gap-2.5">
            {display.avatarUrl ? (
              <img
                src={display.avatarUrl}
                alt={display.nombre}
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
                {display.iniciales}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {display.nombre}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {display.email}
              </div>
            </div>
          </div>

          <form action="/logout" method="POST" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
