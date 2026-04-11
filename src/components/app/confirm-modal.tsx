"use client";

type Props = {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: "default" | "destructive";
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ConfirmModal({
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "default",
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 md:items-center md:p-4"
      onClick={onCancelar}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-sm flex-col overflow-hidden rounded-t-2xl bg-card md:max-h-[85vh] md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="text-lg font-medium">{titulo}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{mensaje}</p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted"
            >
              {textoCancelar}
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 ${
                variante === "destructive"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
