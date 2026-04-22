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
├── .env.example       ← Variables de entorno
├── package.json
└── public/
    ├── index.html     ← Página de login
    └── dashboard.html ← Dashboard (requiere autenticación)
```

---

## ⚙️ Configurar Google Cloud Console

### Paso 1 – Crear proyecto
1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Clic en el selector de proyectos → **Nuevo proyecto**
3. Darle un nombre y crearlo

### Paso 2 – Habilitar Google+ API
1. En el menú → **APIs & Services** → **Library**
2. Buscar **"Google+ API"** o **"People API"** y habilitarla

### Paso 3 – Crear credenciales OAuth
1. **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. En **Authorized redirect URIs** agregar:
   ```
   http://localhost:3000/auth/google/callback
   ```
5. Clic en **Create**
6. Copiar el **Client ID** y **Client Secret**

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
