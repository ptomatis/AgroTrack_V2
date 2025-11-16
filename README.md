# AgroTrack v2.0

Sistema web para gestión de consultas de contacto con API REST y persistencia en base de datos MySQL.

## Información del Proyecto

**Autor:** Pablo Tomatis  
**Versión:** 2.0.0  
**Materia:** Programacion WEB 2

## Mejoras sobre la Versión 1.0

### Base de Datos
- **Migración de archivos de texto a MySQL**: Las consultas ahora se almacenan en una base de datos MySQL en lugar de archivos de texto (`consultas.txt`)
- **Script de setup automatizado**: Comando `npm run setup-db` para crear la base de datos y tablas automáticamente
- **Pool de conexiones**: Implementación de pool de conexiones para mejor rendimiento y escalabilidad

### API REST
- **Endpoints RESTful**: Implementación completa de API REST para gestión de contactos
  - `GET /api/contactos` - Listar todas las consultas
  - `POST /api/contactos` - Registrar nueva consulta
- **Respuestas JSON estructuradas**: Todas las respuestas de la API en formato JSON con estructura consistente

### Validación y Manejo de Errores
- **Validación robusta**: Validación de campos requeridos y formato de email
- **Middleware de manejo centralizado de errores**: Sistema unificado para manejo de errores (400, 404, 500)
- **Códigos de estado HTTP apropiados**: Respuestas con códigos de estado correctos (400 para validación, 201 para creación, etc.)

### Logging y Monitoreo
- **Middleware de logger**: Registro de todas las peticiones HTTP con detalles (método, ruta, IP, status, duración)
- **Endpoint de health check**: `GET /health` para verificar el estado del servidor

### Configuración
- **Variables de entorno con dotenv**: Configuración mediante archivo `.env`
- **Separación de configuración**: Credenciales y configuración fuera del código



## Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm



El servidor estará disponible en `http://localhost:8888`


### Endpoints Web (HTML)

- **GET** `/` - Página de inicio
- **GET** `/contacto` - Formulario de contacto
- **GET** `/contacto/listar` - Lista de consultas (vista web)
- **POST** `/contacto/cargar` - Procesar formulario de contacto
- **GET** `/login` - Página de login
- **POST** `/auth/recuperar` - Procesar login

## Colección de Postman

El proyecto incluye una colección de Postman con todos los endpoints configurados.

### Importar la Colección

1. Abrir Postman
2. Click en **Import**
3. Seleccionar el archivo `AgroTrack.postman_collection.json`
4. La colección se importará con todas las peticiones preconfiguradas

### Endpoints Incluidos en la Colección

- **Inicio** - `GET http://localhost:8888/`
- **Productos** - `GET http://localhost:8888/productos.html`
- **Contacto** - `GET http://localhost:8888/contacto.html`
- **Login** - `GET http://localhost:8888/login.html`
- **Listado Consultas** - `GET http://localhost:8888/contacto/listar`
- **Ruta Inválida** - `GET http://localhost:8888/contacto/listame` (ejemplo de 404)
- **Server Health** - `GET http://localhost:8888/health`
- **API Contactos** - `GET http://localhost:8888/api/contactos`
- **Registrar Consulta** - `POST http://localhost:8888/contacto/cargar`
- **Login Demo** - `POST http://localhost:8888/auth/recuperar`



## Estructura del Proyecto

```
agrotrack_v2/
├── lib/
│   ├── handlers/          # Handlers de rutas
│   │   ├── contacto.js    # Handlers web de contacto
│   │   ├── contacto-api.js # Handlers API REST de contacto
│   │   └── login.js       # Handlers de login
│   ├── middleware/        # Middlewares
│   │   ├── errorHandler.js # Manejo centralizado de errores
│   │   └── logger.js      # Logger de peticiones HTTP
│   ├── utils/             # Utilidades
│   │   ├── body.js        # Utilidades para escape HTML
│   │   └── validation.js  # Validaciones de datos
│   ├── db.js              # Configuración de base de datos
│   └── router.js           # Configuración de rutas
├── public/                 # Archivos estáticos
│   ├── 400.html           # Página de error 400
│   ├── 404.html           # Página de error 404
│   ├── 500.html           # Página de error 500
│   ├── contacto.html      # Formulario de contacto
│   ├── index.html         # Página de inicio
│   ├── login.html         # Página de login
│   ├── productos.html     # Página de productos
│   └── estilos.css        # Estilos CSS
├── scripts/
│   └── setup-db.js        # Script para crear la base de datos
├── sql/
│   └── schema.sql        # Script SQL de creación de tablas
├── .env                   # Variables de entorno (no incluido en repo)
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore            # Archivos ignorados por git
├── package.json          # Dependencias y scripts
├── server.js             # Archivo principal del servidor
├── AgroTrack.postman_collection.json # Colección de Postman
└── README.md             # Este archivo
```

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** v5.1.0 - Framework web
- **MySQL2** v3.15.3 - Cliente de base de datos MySQL
- **dotenv** v17.2.3 - Gestión de variables de entorno

## Scripts Disponibles

- `npm start` - Inicia el servidor
- `npm run setup-db` - Crea la base de datos y tablas automáticamente

## Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `8888` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | (vacío) |
| `DB_NAME` | Nombre de la base de datos | `agrotrack` |
| `NODE_ENV` | Entorno de ejecución | `development` |

## Validaciones Implementadas

- **Campos requeridos**: nombre, email, mensaje
- **Campos no vacíos**: Todos los campos deben tener contenido
- **Formato de email**: Validación mediante expresión regular



## Base de Datos

### Tabla: `contactos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (AUTO_INCREMENT) |
| `nombre` | VARCHAR(100) | Nombre del contacto |
| `email` | VARCHAR(255) | Correo electrónico |
| `mensaje` | TEXT | Mensaje del contacto |
| `fecha` | DATETIME | Fecha y hora de creación (automática) |





