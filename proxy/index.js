require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Helper para obtener el token de Zoho
async function getZohoToken() {
  const url = `${process.env.ZOHO_API_OAUTH}?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`;
  const response = await axios.post(url);
  return response.data.access_token;
}

app.post('/api/zoho/upsert', async (req, res) => {
  const incomingUsers = Array.isArray(req.body) ? req.body : [req.body];
  const results = []; // Aquí acumulamos éxitos y fallos de simulación
  const validUsersToTransmit = []; // Solo los que irán a la API de Zoho

  console.log(`[LOG] [${new Date().toISOString()}] 🚀 Recibidos ${incomingUsers.length} registros.`);

  try {
    const token = await getZohoToken();

    // 1. Fase de Validación y Filtrado (Simulación de Error)
    for (const user of incomingUsers) {
      if (user.fullName && user.fullName.startsWith('C')) {
        const errorMsg = `Error de transmision datos hacia el CRM. Verifique los datos e intente nuevamente.`;
        console.error(`[LOG] ❌ RECHAZADO (Simulación): ID ${user.id} - ${user.fullName}`);
        
        results.push({
          id: user.id,
          status: 'error',
          message: errorMsg
        });
      } else {
        // Si es válido, lo agregamos a la lista de transmisión real
        validUsersToTransmit.push(user);
      }
    }

    // 2. Fase de Transmisión Real a Zoho (Solo si hay usuarios válidos)
    if (validUsersToTransmit.length > 0) {
      try {
        console.log(`[LOG] 📤 Transmitiendo ${validUsersToTransmit.length} registros reales a Zoho CRM...`);

        const zohoPayload = {
          data: validUsersToTransmit.map(u => ({
            Last_Name: u.fullName,
            Email: u.email,
            Phone: u.phone,
            Company: u.companyName
          }))
        };

        const zohoResponse = await axios.post(
          `${process.env.ZOHO_API_DOMAIN}/Contacts/upsert`, 
          zohoPayload, 
          { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
        );

        // Mapeamos las respuestas de la API de Zoho de vuelta a nuestro formato de resultados
        zohoResponse.data.data.forEach((zRes, index) => {
            const isSuccess = zRes.code === 'SUCCESS' || zRes.status === 'success' || zRes.action === 'update' || zRes.action === 'insert';
            
            results.push({
                id: validUsersToTransmit[index].id, 
                zoho_id: zRes.details?.id || null,  
                status: isSuccess ? 'success' : 'error',
                message: zRes.message || `Registro ${zRes.action || 'procesado'}`
            });

            if (isSuccess) {
                console.log(`[LOG] ✨ Zoho ID generado para usuario ${validUsersToTransmit[index].id}: ${zRes.details?.id}`);
            }
        });

      } catch (zohoError) {
        const errMsg = zohoError.response?.data?.message || zohoError.message;
        console.error(`[LOG] 🚨 Error de API Zoho:`, errMsg);
        
        // Marcamos los usuarios que intentamos enviar como fallidos
        validUsersToTransmit.forEach(u => {
          results.push({ id: u.id, status: 'error', message: `Zoho API Error: ${errMsg}` });
        });
      }
    }

    // 3. Resumen y Respuesta Final
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    console.log(`[LOG] 🏁 Lote finalizado. Exitosos: ${successCount}, Errores: ${errorCount}`);
    res.json({ data: results });

  } catch (authError) {
    console.error('[LOG] 🔑 Error de Autenticación:', authError.message);
    res.status(500).json({ error: 'Error de autenticación con el CRM' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  *******************************************
  🚀 Proxy ETL corriendo en puerto ${PORT}
  📡 Monitoreo de Zoho Activo
  *******************************************
  `);
});

