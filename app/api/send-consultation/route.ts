import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    // Prepare data for FormSubmit.co
    const submissionData = {
      nombre: formData.nombre,
      rut: formData.rut,
      email: formData.email,
      telefono: formData.telefono,
      empresa: formData.empresa,
      colaboradores: formData.colaboradores,
      problemas: formData.problemas.join(", "),
      otroProblema: formData.otroProblema,
    }

    // Send to admin email via FormSubmit.co
    const adminFormData = new FormData()
    adminFormData.append("_subject", `Nuevo Cliente: ${formData.nombre} - ${formData.empresa}`)
    adminFormData.append("_captcha", "false")
    adminFormData.append("nombre", formData.nombre)
    adminFormData.append("rut", formData.rut || "No proporcionado")
    adminFormData.append("email", formData.email)
    adminFormData.append("telefono", formData.telefono || "No proporcionado")
    adminFormData.append("empresa", formData.empresa || "No proporcionado")
    adminFormData.append("colaboradores", formData.colaboradores)
    adminFormData.append("problemas", formData.problemas.join(", "))
    adminFormData.append("otroProblema", formData.otroProblema || "No proporcionado")

    try {
      await fetch("https://formsubmit.co/samuel@scalebi.ai", {
        method: "POST",
        body: adminFormData,
      })
    } catch (error) {
      console.error("[v0] Error sending admin email:", error)
    }

    // Send confirmation to customer
    const customerFormData = new FormData()
    customerFormData.append("_subject", "Tu solicitud de consultoría ha sido recibida - Scale BI Consulting")
    customerFormData.append("_template", "table")
    customerFormData.append("_captcha", "false")
    customerFormData.append("nombre", formData.nombre)
    customerFormData.append("empresa", formData.empresa || "No proporcionado")
    customerFormData.append(
      "mensaje",
      "Tu solicitud ha sido recibida. Nuestro equipo se pondrá en contacto contigo en las próximas 2 horas.",
    )

    try {
      await fetch("https://formsubmit.co/samuel@scalebi.ai", {
        method: "POST",
        body: customerFormData,
        headers: {
          Accept: "application/json",
        },
      })
    } catch (error) {
      console.error("[v0] Error sending customer email:", error)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud procesada correctamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in send-consultation:", error)
    return NextResponse.json({ error: "Failed to process consultation", success: false }, { status: 500 })
  }
}
