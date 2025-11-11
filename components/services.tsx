"use client"

const services = [
  {
    icon: "📊",
    title: "BI Analytics",
    description: "Ve tus informes en línea y en un sólo lugar para saber todo lo que pasa en tu empresa",
    features: [
      "Reportes en tiempo real",
      "Integración de múltiples sistemas",
      "Visualización personalizada",
      "Automatización de informes",
      "Acceso centralizado",
      "Análisis detallado",
    ],
    cta: "Agendar Consultoría Gratuita",
  },
  {
    icon: "🤖",
    title: "Advanced Analytics",
    description: "Usa modelos de Analítica Avanzada, descubre demandas futuras, fallas y fugas",
    features: [
      "Machine Learning avanzado",
      "Predicción de demanda",
      "Detección de anomalías",
      "Análisis predictivo",
      "Optimización de procesos",
      "Máxima eficiencia administrativa",
    ],
    cta: "Agendar Consultoría Gratuita",
  },
  {
    icon: "🔗",
    title: "Data Consulting",
    description: "Conecta, centraliza y digitaliza los datos de tu empresa para obtener el máximo valor",
    features: [
      "Integración de sistemas",
      "Centralización de datos",
      "Estrategia de digitalización",
      "Gobernanza de datos",
      "Identificación de KPIs",
      "Implementación de proyectos BI",
    ],
    cta: "Agendar Consultoría Gratuita",
  },
  {
    icon: "⚙️",
    title: "Software Factory",
    description: "Digitaliza tus procesos manuales con aplicaciones web a la medida",
    features: [
      "Aplicaciones web personalizadas",
      "Automatización de procesos",
      "Integración con sistemas actuales",
      "Escalabilidad",
      "Soporte técnico continuo",
      "Adaptación a tus necesidades",
    ],
    cta: "Agendar Consultoría Gratuita",
  },
  {
    icon: "💹",
    title: "Quantitative Finance",
    description: "Modelos matemáticos avanzados para optimización de portafolios y análisis de riesgo",
    features: [
      "Modelado cuantitativo",
      "Optimización de portafolios",
      "Análisis de riesgo",
      "Estrategias de inversión",
      "Valuación de activos",
      "Análisis financiero avanzado",
    ],
    cta: "Agendar Consultoría Gratuita",
  },
]

export default function Services() {
  const handleCtaClick = () => {
    const formSection = document.getElementById("consultation-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f1f2e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-300">
            Soluciones integrales de datos e inteligencia empresarial para optimizar tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#1a2e3e] p-8 rounded-xl border border-[#e8d4b0]/10 hover:border-[#e8d4b0]/30 transition-all"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>

              <ul className="space-y-2 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="text-[#e8d4b0] mr-3 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCtaClick}
                className="w-full py-3 bg-[#1a2e3e] border-2 border-[#e8d4b0] text-[#e8d4b0] font-semibold rounded-lg hover:bg-[#e8d4b0]/10 transition-colors"
              >
                {service.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
