# Around the U.S. — Proyecto 19 (Full Stack)

Aplicación web full stack que permite a los usuarios registrarse, iniciar sesión, editar su perfil y compartir tarjetas con fotos de lugares que han visitado, con la posibilidad de dar "me gusta" a las tarjetas de otros usuarios. Este proyecto unifica el backend (API REST) y el frontend (React) desarrollados en sprints anteriores del bootcamp, y los despliega juntos en un servidor propio en la nube.

## 🌐 Enlaces del proyecto

- **Frontend (aplicación web):** https://around.ohbah.com
- **Frontend (aplicación web):** https://www.around.ohbah.com
- **Backend (API):** https://api.around.ohbah.com

## 🛠️ Tecnologías utilizadas

**Frontend**

- React 19
- React Router DOM
- Vite
- CSS puro (metodología BEM)

**Backend**

- Node.js / Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT) para autenticación
- celebrate / Joi para validación de esquemas
- bcryptjs para el hash de contraseñas
- cors para el manejo de solicitudes de dominio cruzado

**Despliegue e infraestructura**

- Google Cloud Platform (máquina virtual Ubuntu 24)
- Nginx como servidor web y proxy inverso
- PM2 como gestor de procesos en producción
- Certbot / Let's Encrypt para certificados SSL (HTTPS)
- FreeDNS para el registro y apuntado de dominio
- Git / GitHub para control de versiones

## ✨ Funcionalidades

- Registro y autorización de usuarios mediante JWT
- Rutas protegidas según el estado de autenticación (`ProtectedRoute`)
- Edición de perfil (nombre, descripción, avatar)
- Agregar y eliminar tarjetas de lugares
- Dar y quitar "me gusta" a las tarjetas
- Manejo centralizado de errores con clases de error personalizadas
- Validación de datos de entrada en todas las rutas
- Registro (logging) de solicitudes y errores
- El servidor se recupera automáticamente ante caídas gracias a PM2
- Comunicación segura entre frontend y backend vía HTTPS

## 📂 Estructura del repositorio

```
web_project_api_full/
├── backend/     — API en Node.js/Express
├── frontend/    — Aplicación en React
└── README.md
```

## 🔧 Cómo se construyó el proyecto

### Parte I — Backend base y autenticación

- Configuración de la base de datos con `mongoose.connect`.
- Modelos `User` y `Card` con validaciones (incluyendo un validador de URL personalizado para el campo `link`).
- Controladores completos para usuarios (`getUsers`, `getUserById`, `getCurrentUser`, `createUser`, `updateUser`, `updateAvatar`, `login`) y tarjetas (`getCards`, `createCard`, `deleteCard`, `likeCard`, `dislikeCard`).
- Autenticación mediante JWT: middleware `auth.js` que protege las rutas privadas y devuelve `403` ante tokens inválidos o ausentes, según el rubro del proyecto.
- Ruta `GET /users/me` colocada antes de `GET /users/:userId` para evitar conflictos de coincidencia de rutas en Express.
- Verificación de propiedad en `deleteCard`: solo el dueño de una tarjeta puede eliminarla, usando `card.owner.equals(req.user._id)`.
- Campo `password` oculto por defecto (`select: false`) y recuperado explícitamente con `.select('+password')` únicamente durante el login.
- Frontend conectado a una API real: contexto de usuario (`CurrentUserContext`), manejo de like/dislike, edición de perfil y avatar, popup de confirmación de borrado, indicadores de carga y validación de formularios con `checkValidity()`.
- Flujo de autenticación completo en React: `Register`, `Login`, `InfoTooltip`, `ProtectedRoute`, persistencia de sesión mediante `localStorage` y verificación del token al cargar la aplicación.

### Parte II — Manejo de errores, validación y despliegue

- **Manejo centralizado de errores:** middleware `errorHandler.js` de 4 parámetros y clases de error personalizadas (`NotFoundError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`), reemplazando el manejo disperso de errores por un patrón consistente de `throw` / `catch(next)`.
- **Validación de esquemas:** integración de `celebrate` con validadores dedicados para cada ruta (`validateSignup`, `validateSignin`, `validateCard`, `validateCardId`, `validateUserId`, `validateUpdateUser`, `validateUpdateAvatar`), probados en Postman para confirmar respuestas `400` ante datos inválidos.
- **Registro (logging):** middlewares de `request` y `error` logging para monitorear el uso de la API y depurar incidencias en producción.
- **Preparación del repositorio:** unificación de `backend/` y `frontend/` bajo un único repositorio Git en la raíz (sin carpetas `.git` anidadas), con archivos `.gitignore` independientes para cada carpeta, excluyendo `node_modules`, `.env` y archivos de build.
- **Servidor en la nube:** creación de una máquina virtual en Google Cloud, con Node.js, Git, MongoDB y PM2 instalados.
- **Conexión SSH:** generación de un par de llaves SSH en el servidor y registro de la llave pública en GitHub para permitir el clonado del repositorio vía `git clone` por SSH.
- **Variables de entorno de producción:** archivo `.env` creado directamente en el servidor (nunca versionado) con `NODE_ENV=production` y una clave `JWT_SECRET` aleatoria generada con el módulo `crypto` de Node.
- **CORS en producción:** habilitado con el paquete `cors`, incluyendo el ajuste `app.options('*splat', cors())` requerido por la sintaxis de comodines de Express 5 (`path-to-regexp` v6+, que ya no acepta `'*'` como comodín sin nombre).
- **Gestión de procesos con PM2:** despliegue del backend con `pm2 start app.js`, configuración de arranque automático tras reinicio del servidor (`pm2 startup` + `pm2 save`), y verificación de la recuperación automática del proceso ante caídas mediante la ruta temporal `/crash-test`.
- **Build y despliegue del frontend:** generación del build de producción con `vite build` en local, y transferencia de los archivos estáticos al servidor mediante `scp`, evitando instalar dependencias de desarrollo innecesarias en la VM.
- **Configuración de Nginx:** bloques de servidor independientes para el frontend (sirviendo los archivos estáticos de `frontend/dist`) y para la API (como proxy inverso hacia el backend en `localhost:3000`).
- **Certificados HTTPS:** emisión y configuración de certificados SSL con Certbot (instalado vía snap) para ambos subdominios.
- **Depuración de la integración frontend–backend:** corrección de la lectura de las respuestas de la API (todas las respuestas del backend devuelven los datos envueltos en `{ data: ... }`), ajuste de la lógica de "me gusta" comparando el `_id` del usuario actual contra el arreglo `likes` de cada tarjeta, y sincronización de la carga de datos del usuario y las tarjetas con el estado de sesión (`isLoggedIn`) para evitar la necesidad de recargar la página manualmente tras iniciar sesión.

## 🚀 Cómo correr el proyecto localmente

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📋 Notas de despliegue

- El archivo `.env` del backend **no** se versiona; debe crearse manualmente en el servidor con `NODE_ENV` y `JWT_SECRET`.
- El frontend no se ejecuta directamente en el servidor: solo se sube su build de producción (`dist/`), generado localmente con `npm run build`.
- El proceso del backend se gestiona con PM2 para garantizar disponibilidad continua y recuperación automática ante fallos.
