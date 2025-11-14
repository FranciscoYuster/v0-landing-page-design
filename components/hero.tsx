"use client"

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance text-white">
            Escala tu negocio con <span className="text-[#e8d4b0]">Data Science y Automatización de procesos.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conectamos tus sistemas, automatizamos procesos y visualizamos lo que importa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
            <a
              href="#consultation-form"
              className="px-8 py-4 bg-[#e8d4b0] text-[#1a2e3e] font-semibold rounded-lg hover:bg-[#f5deb3] transition-colors text-center"
            >
              Agenda tu Consultoría Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
