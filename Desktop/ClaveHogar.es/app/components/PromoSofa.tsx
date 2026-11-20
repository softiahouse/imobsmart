"use client";

// YouTube video ID — substituir quando o link estiver disponível
const YOUTUBE_ID = ""; // ex: "dQw4w9WgXcQ"

export default function PromoSofa() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-white py-16 px-4 border-b border-amber-100">
      <div className="max-w-5xl mx-auto">

        {/* Etiqueta promoção */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-bold text-sm px-4 py-1.5 rounded-full uppercase tracking-wide">
            🔥 Oferta Especial — Tempo Limitado
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Coluna esquerda: vídeo */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video">
            {YOUTUBE_ID ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0&rel=0`}
                title="Limpeza de sofás ClaveHogar Torrevieja"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* Placeholder enquanto não há vídeo */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg className="w-9 h-9 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm text-slate-400">Vídeo em breve</p>
              </div>
            )}
          </div>

          {/* Coluna direita: oferta */}
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Limpeza profissional<br />
              <span className="text-amber-500">de sofás em Torrevieja</span>
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Conjunto de sofás limpos como novos — sem produtos tóxicos,
              sem mau cheiro, sem esperas. Resultado visível em 1 visita.
            </p>

            {/* Preço riscado → novo */}
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-medium">Preço normal</span>
                <span className="text-2xl text-slate-400 line-through font-bold">149 €</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-green-600 font-semibold">Preço especial hoje</span>
                <span className="text-5xl font-extrabold text-green-600 leading-none">69,90 €</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">Conjunto de sofás (até 3 lugares). Torrevieja e arredores.</p>

            {/* CTA */}
            <a
              href="https://wa.me/34693976311?text=Hola!%20Vi%20la%20oferta%20de%20limpieza%20de%20sof%C3%A1s%20por%2069%2C90%20%E2%82%AC.%20Me%20interesa!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Quero agendar — 69,90 €
            </a>

            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>✅</span> Sem compromisso · Resposta em minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
