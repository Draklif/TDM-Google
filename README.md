# 🔐 Google Auth Demo – Taller de Diseño Multimedia

App Node.js que demuestra:
- **Google OAuth 2.0** con Passport.js
- **Sesiones de servidor** con express-session
- **localStorage** como caché del lado cliente

---

## 📁 Estructura del proyecto

```
google-auth-demo/
├── server.js          ← Servidor Express + Passport + rutas OAuth
├── .env.example       ← Variables de entorno (copiar como .env)
├── package.json
└── public/
    ├── index.html     ← Página de login
    └── dashboard.html ← Dashboard (requiere autenticación)
```

---

## ⚙️ Configurar Google Cloud Console

### Paso 1 – Crear proyecto
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Clic en el selector de proyectos → **Nuevo proyecto**
3. Dale un nombre y créalo

### Paso 2 – Habilitar Google+ API
1. En el menú → **APIs & Services** → **Library**
2. Busca **"Google+ API"** o **"People API"** y habilítala

### Paso 3 – Crear credenciales OAuth
1. **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. En **Authorized redirect URIs** agrega:
   ```
   http://localhost:3000/auth/google/callback
   ```
5. Clic en **Create**
6. Copia el **Client ID** y **Client Secret**

### Paso 4 – Pantalla de consentimiento
1. **OAuth consent screen** → External → **Create**
2. Llena: App name, User support email, Developer email
3. Scopes: agrega `email` y `profile`
4. Agrega tu email como **Test user**

---

## 🚀 Correr el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales de Google

# 3. Iniciar servidor
node server.js

# 4. Abrir en el navegador
# http://localhost:3000
```

---

## 🗺️ Flujo OAuth 2.0

```
Usuario                Tu App                    Google
   │                      │                         │
   │── clic en botón ───→ │                         │
   │                      │── redirect ──────────→  │
   │                      │   (con client_id)        │
   │                      │                         │── muestra login
   │                      │                         │   y permisos
   │                      │        ←── code ────────│
   │                      │── intercambia code ───→ │
   │                      │       ←── tokens ───────│
   │                      │── obtiene perfil ─────→ │
   │                      │       ←── perfil ───────│
   │← sesión creada ───── │                         │
   │   (cookie sid)        │                         │
```

---

## 🔑 Conceptos clave

| Concepto | Dónde vive | Accesible desde JS | Cuándo usar |
|---|---|---|---|
| **Sesión (express-session)** | Servidor | ❌ No | Datos sensibles, autenticación |
| **Cookie connect.sid** | Navegador | ❌ No (httpOnly) | ID de sesión |
| **localStorage** | Navegador | ✅ Sí | Preferencias, caché de perfil |
| **sessionStorage** | Navegador | ✅ Sí | Datos temporales de esa pestaña |

---

## 📡 Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Página de login |
| GET | `/auth/google` | Inicia flujo OAuth |
| GET | `/auth/google/callback` | Callback de Google |
| GET | `/auth/logout` | Cierra sesión |
| GET | `/api/me` | Retorna usuario autenticado |
| GET | `/dashboard.html` | Dashboard (requiere login) |
