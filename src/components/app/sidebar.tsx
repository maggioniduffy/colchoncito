import Link from "next/link";
import { getUser, toDisplayUser } from "@/lib/supabase/get-user";
import SidebarNav from "./sidebar-nav";

export default async function Sidebar() {
  const user = await getUser();
  const display = user ? toDisplayUser(user) : null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-5 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-medium text-white">
          C
        </div>
        <span className="text-base font-medium text-gray-900">Colchoncito</span>
      </div>

      <SidebarNav />

      <Link
        href="/nuevo"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        <span className="text-lg leading-none">+</span>
        <span>Nuevo movimiento</span>
      </Link>

      {display && (
        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2.5">
            {display.avatarUrl ? (
              <img
                src={display.avatarUrl}
                alt={display.nombre}
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                {display.iniciales}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-gray-900">
                {display.nombre}
              </div>
              <div className="truncate text-[11px] text-gray-500">
                {display.email}
              </div>
            </div>
          </div>

          <form action="/logout" method="POST" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
