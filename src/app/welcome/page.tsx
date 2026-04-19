import Footer from "@/components/app/footer";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    titulo: "Cotizaciones en vivo",
    desc: "Oficial, MEP, Blue y Crypto actualizadas automáticamente. Elegí cuál usar para tus conversiones.",
    icono: "💱",
  },
  {
    titulo: "Presupuesto anual",
    desc: "Cargá tus aportes, elegí en cuántos meses dividirlos, y sabé exactamente cuánto podés gastar por mes.",
    icono: "📊",
  },
  {
    titulo: "Pesos y dólares",
    desc: "Cada monto se muestra en ambas monedas. Cambiá la cotización y todo se recalcula al instante.",
    icono: "💵",
  },
  {
    titulo: "Gastos fijos y variables",
    desc: "Sueldo, alquiler, Netflix van como fijos. El resto lo cargás cuando pasa. Todo suma al presupuesto del mes.",
    icono: "📋",
  },
  {
    titulo: "Historial de aumentos",
    desc: "Cuando te aumentan el sueldo o sube el alquiler, la app recuerda cuánto era antes y cuánto es ahora.",
    icono: "📈",
  },
  {
    titulo: "Instalable en tu celu",
    desc: "Es una PWA: se instala como app nativa desde el navegador. Funciona en Android, iPhone y desktop.",
    icono: "📱",
  },
];

const PASOS = [
  { numero: "1", texto: "Cargá los aportes con los que arrancás el año" },
  { numero: "2", texto: "Elegí en cuántos meses repartirlos" },
  { numero: "3", texto: "Agregá tus ingresos y gastos fijos mensuales" },
  {
    numero: "4",
    texto: "Cada gasto que cargás se resta del presupuesto del mes",
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-primary-foreground">
              <Image
                src="/android-chrome-512x512.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </div>
            <span className="text-base font-medium">Colchoncito</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-medium leading-tight md:text-5xl md:leading-tight">
            Tus finanzas en pesos y dólares,{" "}
            <span className="text-primary">sin planillas</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:mt-6 md:text-lg">
            La app de presupuesto pensada para la realidad argentina.
            Cotizaciones automáticas, presupuesto anual dividido por mes, y todo
            se recalcula al instante cuando cambia el dólar.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="w-full rounded-xl bg-primary px-8 py-3 text-center text-base font-medium text-primary-foreground hover:opacity-90 sm:w-auto"
            >
              Empezar gratis
            </Link>

            <a
              href="#como-funciona"
              className="w-full rounded-xl border border-border px-8 py-3 text-center text-base hover:bg-muted sm:w-auto"
            >
              ¿Cómo funciona?
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Gratis · Sin tarjeta · Login con Google
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="mb-10 text-center text-2xl font-medium md:mb-14 md:text-3xl">
            Pensada para argentinos
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.titulo}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-3 text-2xl">{f.icono}</div>
                <h3 className="mb-1 text-sm font-medium">{f.titulo}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="mb-10 text-center text-2xl font-medium md:mb-14 md:text-3xl">
            ¿Cómo funciona?
          </h2>
          <div className="mx-auto max-w-lg">
            {PASOS.map((paso, i) => (
              <div key={paso.numero} className="flex gap-4 pb-8">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {paso.numero}
                  </div>
                  {i < PASOS.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <p className="pt-2 text-sm text-muted-foreground leading-relaxed">
                  {paso.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problema → Solución */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 rounded-xl border border-border bg-card p-6">
              <p className="mb-2 text-xs font-medium text-destructive">
                EL PROBLEMA
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tenés una planilla de Excel con columnas de pesos y dólares, una
                celda con la cotización que actualizás a mano, y cada vez que
                querés saber cuánto podés gastar este mes hacés una cuenta
                mental que nunca da igual.
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <p className="mb-2 text-xs font-medium text-primary">
                COLCHONCITO
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cargás tu presupuesto una vez, elegís la cotización que usás, y
                la app te dice exactamente cuánto te queda para gastar este mes.
                Cada gasto que cargás actualiza el número al instante. Sin
                fórmulas, sin celdas, sin dolor de cabeza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-2xl font-medium md:text-3xl">
            Dejá la planilla. Probá Colchoncito.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Es gratis, se instala como app en tu celu, y arrancás en 2 minutos.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-primary px-10 py-3.5 text-base font-medium text-primary-foreground hover:opacity-90"
          >
            Crear cuenta con Google
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FloatingCTA() {
  return (
    <>
      <style>{`
        .floating-cta {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s, transform 0.3s;
          pointer-events: none;
        }
        .floating-cta.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>
      <div
        id="floating-cta"
        className="floating-cta fixed bottom-6 left-0 right-0 z-50 flex justify-center px-5 md:bottom-8"
      >
        <a
          href="/login"
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90"
        >
          Empezar gratis →
        </a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var el = document.getElementById('floating-cta');
              if (!el) return;
              var shown = false;
              window.addEventListener('scroll', function() {
                var shouldShow = window.scrollY > 400;
                if (shouldShow !== shown) {
                  shown = shouldShow;
                  el.classList.toggle('visible', shown);
                }
              });
            })();
          `,
        }}
      />
    </>
  );
}
