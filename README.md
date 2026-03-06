# 🚀 User ETL Pipeline & Zoho CRM Integration
Este proyecto es un ecosistema completo de procesamiento de datos (Extract, Transform, Load) que consume información de una API externa, aplica reglas de negocio y normalización mediante Zod, gestiona el estado con Pinia (Vue 3) y sincroniza los datos con Zoho CRM a través de un Proxy seguro (BFF).


## 🏗️ Arquitectura del Sistema
El sistema utiliza un patrón BFF (Backend-for-Frontend) para resolver dos desafíos críticos en integraciones empresariales:

1. **Seguridad de Credenciales**: Las llaves privadas de Zoho (Client ID, Secret y Refresh Token) nunca se exponen al cliente (navegador). Residen exclusivamente en el servidor Proxy.

2. **Resolución de CORS**: Evita el uso de extensiones o configuraciones inseguras en el navegador, ya que la comunicación con Zoho se realiza de servidor a servidor.

### Flujo de Datos (ETL)
- Extract: Los datos se extraen de JSONPlaceholder.

- Transform: Se normalizan teléfonos (solo dígitos), sitios web (prefijo https) y se validan reglas de negocio sobre nombres de empresas mediante esquemas de Zod.

- Load: Los datos se envían a Zoho CRM. El sistema captura los IDs únicos generados por Zoho para confirmar la inserción exitosa.

## 🛠️ Instalación y Configuración
El repositorio está organizado como un monorepo simple. Sigue estos pasos para la puesta en marcha:

### 1. Clonar y preparar dependencias
```bash
# Instalar dependencias del Frontend
cd user-etl-project
npm install

# Instalar dependencias del Proxy
cd ../proxy
npm install
```

### 2. Configuración del Entorno (Proxy)
Crea un archivo .env dentro de la carpeta /proxy. Este archivo contiene las credenciales sensibles:

```
PORT=3001
ZOHO_CLIENT_ID=tu_client_id
ZOHO_CLIENT_SECRET=tu_client_secret
ZOHO_REFRESH_TOKEN=tu_refresh_token
ZOHO_API_DOMAIN=https://www.zohoapis.com/crm/v2
ZOHO_API_OAUTH=https://accounts.zoho.com/oauth/v2/token
```

## 🚀 Ejecución
Para que el sistema funcione correctamente, debes iniciar ambos servicios en terminales separadas:

### Servidor Proxy (Puerto 3001):

```bash
cd proxy
node index.js
```

### Aplicación Frontend (Puerto 5173):

```bash
cd user-etl-project
npm run dev
```

## 🔧 Funcionalidades Clave
### 1. Centralización de Lógica de Transmisión
Se ha implementado una función centralizada de servicio que maneja la comunicación con el Proxy. Esta lógica es reutilizada de forma idéntica por:

- **Formulario de Edición Individual**: Permite corregir datos manualmente antes del envío.

- **Sincronización Masiva**: Permite seleccionar múltiples registros válidos y enviarlos en un solo lote (Batch Processing).

### 2. Resiliencia y Manejo de Errores
El Proxy implementa una lógica de control de errores parciales:

- **Simulación de Error**: Cualquier registro cuyo nombre comience con la letra "C" es rechazado automáticamente por el servidor con un mensaje descriptivo, simulando un fallo de API.

- **Procesamiento No Bloqueante**: Si un envío masivo de 10 usuarios contiene 2 fallidos (ej: por la regla de la "C"), el Proxy procesará los 8 restantes exitosamente y devolverá un reporte detallado del estado de cada uno.

### 3. Monitoreo (Logging)
El servidor Proxy incluye un sistema de logs en consola que permite monitorear en tiempo real:

- Timestamps de las peticiones.
- Resultados de validación interna.
- Respuestas directas de la API de Zoho, incluyendo los IDs de registros creados.

## 📂 Estructura del Proyecto
```bash
/
├── proxy/                   # Middleware Express (BFF)
│   ├── index.js             # Lógica central y Proxy Zoho
│   └── .env                 # Variables de entorno (excluido de Git)
├── user-etl-project/        # Aplicación Vue 3 + Vite
│   ├── src/
│   │   ├── api/             # Servicios de comunicación
│   │   ├── stores/          # Estado global con Pinia
│   │   ├── schemas/         # Validaciones ETL con Zod
│   │   └── components/      # UI y Formularios
└── .gitignore               # Configuración global de exclusión

```

