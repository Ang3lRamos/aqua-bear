import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, service, date, time, participants, notes } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Aqua Bear Swim Club <onboarding@resend.dev>',
      to: 'angelf.ramosc@unac.edu.co',
      subject: `Nueva Reserva - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e4a6e 0%, #3b82a0 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Reserva en Aqua Bear</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e4a6e; margin-top: 0;">Datos del Cliente</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Nombre:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Telefono:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Correo:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${email || 'No proporcionado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Servicio:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Fecha:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Hora:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Participantes:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${participants}</td>
              </tr>
              ${notes ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Notas:</td>
                <td style="padding: 10px 0; color: #1e293b;">${notes}</td>
              </tr>
              ` : ''}
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background: #1e4a6e; border-radius: 8px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aqua-bear.vercel.app'}/admin" 
                 style="color: white; text-decoration: none; font-weight: bold; font-size: 16px;">
                Ver en Panel de Administracion
              </a>
            </div>
          </div>
          
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Este correo fue enviado automaticamente desde Aqua Bear Swim Club
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ error: 'Error al enviar correo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in send-notification:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
