export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-24 px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            URNA MIHAIYOVA
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Plataforma de Talento y Oportunidades
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            Conectando profesionales con las mejores oportunidades en Torrevieja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-12">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">💼</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Para Profesionales
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Encuentra las mejores oportunidades laborales adaptadas a tu perfil
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🏢</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Para Empresas
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Acceso a talento verificado y especializado para tu negocio
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🚀</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Crecimiento
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Herramientas y recursos para potenciar tu carrera profesional
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/auth/signup"
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Comenzar Ahora
          </a>
          <a
            href="/about"
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Más Información
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            URNA MIHAIYOVA - Plataforma de talento y oportunidades para Torrevieja
          </p>
        </div>
      </main>
    </div>
  );
}
