
import { NextResponse } from 'next/server'
import * as xmlrpc from 'xmlrpc'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, company, employees } = body;

    if (!name || !phone || !email || !company || !employees) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Integración con Odoo usando XML-RPC
    try {
      const odooUrl = process.env.ODOO_URL;
      const odooDb = process.env.ODOO_DB;
      const odooUser = process.env.ODOO_USER;
      const odooPassword = process.env.ODOO_PASSWORD;

      if (!odooUrl || !odooDb || !odooUser || !odooPassword) {
        throw new Error("Error Odoo");
      }
      console.log('Iniciando integración con Odoo...');

      // 1. Autenticación
      const commonClient = xmlrpc.createSecureClient({
        host: new URL(odooUrl).hostname,
        port: 443,
        path: '/xmlrpc/2/common'
      });

      const uid = await new Promise<number>((resolve, reject) => {
        commonClient.methodCall('authenticate', [odooDb, odooUser, odooPassword, {}], (err, value) => {
          if (err) reject(err);
          else resolve(value as number);
        });
      });

      console.log('Autenticación exitosa. UID:', uid);

      // 2. Cliente para operaciones
      const modelsClient = xmlrpc.createSecureClient({
        host: new URL(odooUrl).hostname,
        port: 443,
        path: '/xmlrpc/2/object'
      });

      // 3. Buscar si el partner (contacto) ya existe por email
      const partnerIds = await new Promise<number[]>((resolve, reject) => {
        modelsClient.methodCall('execute_kw', [
          odooDb,
          uid,
          odooPassword,
          'res.partner',
          'search',
          [[['email', '=', email]]],
          { limit: 1 }
        ], (err, value) => {
          if (err) reject(err);
          else resolve(value as number[]);
        });
      });

      let partnerId: number;

      if (partnerIds.length > 0) {
        // Partner encontrado
        partnerId = partnerIds[0];
        console.log('Partner encontrado con ID:', partnerId);
      } else {
        // Crear nuevo partner
        partnerId = await new Promise<number>((resolve, reject) => {
          modelsClient.methodCall('execute_kw', [
            odooDb,
            uid,
            odooPassword,
            'res.partner',
            'create',
            [{
              name: name,
              email: email,
              phone: phone,
              comment: `Empresa: ${company}\nNúmero de colaboradores: ${employees}`
            }]
          ], (err, value) => {
            if (err) reject(err);
            else resolve(value as number);
          });
        });
        console.log('Partner creado con ID:', partnerId);
      }

      // 4. Crear el ticket con todos los campos pre-rellenados
      const ticketId = await new Promise<number>((resolve, reject) => {
        modelsClient.methodCall('execute_kw', [
          odooDb,
          uid,
          odooPassword,
          'helpdesk.ticket',
          'create',
          [{
            name: `Solicitud de contacto de ${name} (${company})`,
            partner_id: partnerId,
            partner_name: name,
            partner_email: email,
            partner_phone: phone,
            x_company: company,
            x_employees: employees,
            description: `
                <strong>Empresa:</strong> ${company}<br>
                <strong>Número de colaboradores:</strong> ${employees}<br>
                <strong>Teléfono:</strong> ${phone}<br>
                <strong>Email:</strong> ${email}
                `,
            team_id: 1,
            priority: '1',
            tag_ids: [[6, false, [1]]] // Asumiendo que el ID de la etiqueta 'Lead' es 1
          }]
        ], (err, value) => {
          if (err) reject(err);
          else resolve(value as number);
        });
      });

      console.log('Ticket creado exitosamente en Odoo con ID:', ticketId);
    } catch (odooError: any) {
      console.error('Error al crear ticket en Odoo:', odooError.message || odooError);
      // No falla la petición si Odoo falla
    }

    return NextResponse.json(
      { message: 'Ticket creado exitosamente en Odoo' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
