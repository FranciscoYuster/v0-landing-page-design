"use client"

import type React from "react"
import { useState } from "react"

type ConsultationFormData = {
  nombre: string
  rut: string
  email: string
  telefono: string
  empresa: string
  colaboradores: string
  problemas: string[]
  otroProblema: string
}

export default function ConsultationForm() {
  const [formData, setFormData] = useState<ConsultationFormData>({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    empresa: "",
    colaboradores: "",
    problemas: [],
    otroProblema: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const empleadosOptions = ["1-5", "6-10", "11-20", "21-35", "35-50", "51-100", "101-200", "201-300", "300+"]

  const problemasOptions = [
    "No veo en tiempo real lo que pasa en mi empresa",
    "Paso muchas horas creando reportes manualmente",
    "Tengo datos dispersos en varios sistemas que no se conectan",
    "No puedo predecir ventas, demanda o detectar problemas a tiempo",
    "Tengo procesos manuales que necesito automatizar",
    "No tengo claridad de mi situación financiera real",
    "Otro problema",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleProblemasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      problemas: checked ? [...prev.problemas, value] : prev.problemas.filter((p) => p !== value),
    }))
    setError("")
  }

  const handleOtroProblemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      otroProblema: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.nombre.trim()) {
      setError("Por favor ingresa tu nombre completo")
      return
    }
    if (!formData.email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }
    if (!formData.colaboradores) {
      setError("Por favor selecciona el número de colaboradores")
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Sending form data:", formData)

      const response = await fetch("/api/send-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nombre,
          phone: formData.telefono,
          email: formData.email,
          company: formData.empresa,
          employees: formData.colaboradores,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        console.log("[v0] Form submitted successfully, redirecting to calendar")
        const calendarUrl = `https://cal.com/samuel-orellana/30min?overlayCalendar=true&name=${encodeURIComponent(formData.nombre)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.telefono)}`
        window.location.href = calendarUrl
      } else {
        const errorData = await response.json()
        console.log("[v0] Error response:", errorData)
        setError("Hubo un error al enviar el formulario. Por favor intenta nuevamente.")
      }
    } catch (error) {
      console.error("[v0] Error sending form:", error)
      setError("Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="consultation-form" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0f1f2e]/50 border border-[#e8d4b0]/20 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            Solicita tu Consultoría Gratuita
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Cuéntanos sobre tu empresa y los desafíos que enfrenta. Nuestro equipo se pondrá en contacto pronto.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div>
              <label className="block text-white font-medium mb-2">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* RUT */}
            <div>
              <label className="block text-white font-medium mb-2">RUT</label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition"
                placeholder="12345678-9"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-white font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition"
                placeholder="+56 9 12345678"
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-white font-medium mb-2">Empresa</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition"
                placeholder="Nombre de tu empresa"
              />
            </div>

            {/* Colaboradores */}
            <div>
              <label className="block text-white font-medium mb-2">Número de Colaboradores</label>
              <select
                name="colaboradores"
                value={formData.colaboradores}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white focus:outline-none focus:border-[#e8d4b0] transition"
              >
                <option value="">Selecciona una opción</option>
                {empleadosOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} empleados
                  </option>
                ))}
              </select>
            </div>

            {/* Problemas - Selección Múltiple */}
            <div>
              <label className="block text-white font-medium mb-4">
                ¿Cuáles son tus principales problemas? (selecciona uno o varios)
              </label>
              <div className="space-y-3">
                {problemasOptions.map((problema) => (
                  <label key={problema} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      value={problema}
                      checked={formData.problemas.includes(problema)}
                      onChange={handleProblemasChange}
                      className="mt-1 w-5 h-5 accent-[#e8d4b0] cursor-pointer"
                    />
                    <span className="text-gray-300 group-hover:text-[#e8d4b0] transition">{problema}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.problemas.includes("Otro problema") && (
              <div>
                <label className="block text-white font-medium mb-2">Describe tu problema</label>
                <textarea
                  name="otroProblema"
                  value={formData.otroProblema}
                  onChange={handleOtroProblemaChange}
                  className="w-full px-4 py-3 bg-[#1a2e3e] border border-[#e8d4b0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e8d4b0] transition resize-none"
                  placeholder="Cuéntanos tu problema específico..."
                  rows={4}
                />
              </div>
            )}

            {error && <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-semibold rounded-lg transition-colors mt-8 ${
                loading
                  ? "bg-[#e8d4b0]/50 text-[#1a2e3e]/50 cursor-not-allowed"
                  : "bg-[#e8d4b0] text-[#1a2e3e] hover:bg-[#f5deb3]"
              }`}
            >
              {loading ? "Enviando..." : "Agendar Consultoría Gratuita"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
