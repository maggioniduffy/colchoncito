import BottomNav from "@/components/app/bottom-nav";
import Sidebar from "@/components/app/sidebar";
import { fetchAllCotizaciones } from "@/lib/cotizaciones/fetch";
import { createClient } from "@/lib/supabase/server";
import CotizacionLoader from "./cotizacion/loader";
import type { TipoCotizacion } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cotizaciones, supabase] = await Promise.all([
    fetchAllCotizaciones(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let activa: TipoCotizacion = "mep"; // default
  if (user) {
    const { data: config } = await supabase
      .from("usuario_config")
      .select("cotizacion_activa")
      .eq("user_id", user.id)
      .single();
    if (config?.cotizacion_activa) {
      activa = config.cotizacion_activa;
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CotizacionLoader cotizaciones={cotizaciones} activa={activa} />
      <Sidebar />
      <div className="flex max-h-screen flex-1 flex-col">
        <main className="h-full flex-1 overflow-y-auto pb-2 pt-3 md:px-8 md:pt-8">
          <div className="h-full mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
