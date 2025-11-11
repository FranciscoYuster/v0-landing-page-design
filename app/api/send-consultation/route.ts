import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

type FormPayload = {
  nombre: string
  rut?: string
  email: string
  telefono?: string
  empresa?: string
  colaboradores: string
  problemas: string[]
  otroProblema?: string
}

// Initialize Resend SDK (server-side). It will read the API key from env.
function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function POST(req: NextRequest) {
  try {
    const formData: FormPayload = await req.json()

    // Basic validation
    if (!formData || !formData.nombre || !formData.email || !formData.colaboradores) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }
  // Read configuration from environment variables
    const resendKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM || "samuel@scalebi.ai"
    const adminEmail = process.env.ADMIN_EMAIL || "samuel@scalebi.ai"

    if (!resendKey) {
      console.error("[v0] RESEND_API_KEY is not configured")
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 })
    }

    const problemasText = Array.isArray(formData.problemas) ? formData.problemas.join(", ") : String(formData.problemas || "No proporcionado")

    // Build HTML for admin notification with proper structure and inline styles
    const adminHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Cliente</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #0f1f2e; padding: 30px; text-align: center;">
              <h1 style="color: #e8d4b0; margin: 0; font-size: 28px;">🎉 Nuevo Cliente</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Nombre:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.nombre}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">RUT:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.rut || "No proporcionado"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Email:</strong>
                    <span style="color: #333; margin-left: 10px;"><a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">${formData.email}</a></span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Teléfono:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.telefono || "No proporcionado"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Empresa:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.empresa || "No proporcionado"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Colaboradores:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.colaboradores}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #0f1f2e;">Problemas:</strong>
                    <span style="color: #333; margin-left: 10px;">${problemasText}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #0f1f2e;">Otro problema:</strong>
                    <span style="color: #333; margin-left: 10px;">${formData.otroProblema || "No proporcionado"}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">Scale BI Consulting - Notificación automática</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Build HTML for customer confirmation with proper structure and inline styles
    const customerHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud Recibida</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #0f1f2e; padding: 30px; text-align: center;">
              <h1 style="color: #e8d4b0; margin: 0; font-size: 28px;">✅ Solicitud Recibida</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0f1f2e; margin-top: 0;">Hola ${formData.nombre},</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                ¡Gracias por contactarnos! Hemos recibido tu solicitud de consultoría.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Nuestro equipo revisará tu información y se pondrá en contacto contigo en las próximas <strong>48 horas</strong>.
              </p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Empresa:</strong> ${formData.empresa || "No proporcionado"}</p>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Si necesitas contactarnos antes o tienes alguna pregunta, no dudes en responder a este correo.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Saludos cordiales,<br>
                <strong>Equipo Scale BI Consulting</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">Scale BI Consulting</p>
              <p style="margin: 5px 0 0 0;">Transformando datos en decisiones</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Create SDK client
    const resendClient = getResendClient()
    if (!resendClient) {
      console.error("[v0] RESEND_API_KEY is not configured")
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 })
    }

    // Send admin notification using SDK
    try {
      const adminResp = await resendClient.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `Nuevo Cliente: ${formData.nombre} - ${formData.empresa || "Sin empresa"}`,
        html: adminHtml,
      })
      
      // Check if response contains an error
      if ((adminResp as any).error) {
        console.error("[v0] Resend admin error:", (adminResp as any).error)
        return NextResponse.json({ 
          success: false, 
          error: "Failed to send admin email",
          details: (adminResp as any).error 
        }, { status: 502 })
      }
      
      console.log("[v0] Admin email sent successfully:", (adminResp as any).data?.id || adminResp.id)
    } catch (err) {
      console.error("[v0] Error sending admin email via Resend:", err)
      return NextResponse.json({ success: false, error: "Failed to send admin email" }, { status: 502 })
    }

    // Send confirmation to customer using SDK
    try {
      const customerResp = await resendClient.emails.send({
        from: fromEmail,
        to: formData.email,
        subject: "Tu solicitud de consultoría ha sido recibida - Scale BI Consulting",
        html: customerHtml,
      })
      
      // Check if response contains an error
      if ((customerResp as any).error) {
        console.error("[v0] Resend customer error:", (customerResp as any).error)
        return NextResponse.json({ 
          success: false, 
          error: "Failed to send customer confirmation",
          details: (customerResp as any).error 
        }, { status: 502 })
      }
      
      console.log("[v0] Customer email sent successfully:", (customerResp as any).data?.id || customerResp.id)
    } catch (err) {
      console.error("[v0] Error sending customer email via Resend:", err)
      return NextResponse.json({ success: false, error: "Failed to send customer confirmation" }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: "Emails sent" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error in send-consultation:", error)
    return NextResponse.json({ error: "Failed to process consultation", success: false }, { status: 500 })
  }
}
