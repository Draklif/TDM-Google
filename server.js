require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");

const app = express();

// ─────────────────────────────────────────────
// 1. CONFIGURACIÓN DE SESIÓN (lado servidor)
//    express-session guarda una cookie con el
//    session ID; los datos viven en memoria del server.
// ─────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      httpOnly: true,               // No accesible desde JS (seguridad)
    },
  })
);

// ─────────────────────────────────────────────
// 2. PASSPORT – serialización del usuario
//    serialize: qué guardar en la sesión
//    deserialize: cómo recuperar al usuario
// ─────────────────────────────────────────────
passport.serializeUser((user, done) => {
  // Solo guardamos el id en la sesión para no sobrecargarla
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ─────────────────────────────────────────────
// 3. ESTRATEGIA DE GOOGLE OAuth 2.0
// ─────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Aquí normalmente buscarías/crearías el usuario en tu DB
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: "google",
      };
      return done(null, user);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// ─────────────────────────────────────────────
// 4. ARCHIVOS ESTÁTICOS (frontend)
// ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────────────────────────
// 5. RUTAS DE AUTENTICACIÓN
// ─────────────────────────────────────────────
// Inicia el flujo OAuth → redirige a Google
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Qué permisos pedimos
  })
);

// Google nos redirige aquí con un "code"
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/?error=auth_failed" }),
  (req, res) => {
    res.redirect("/dashboard.html");
  }
);

// Cerrar sesión (servidor + cliente)
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// ─────────────────────────────────────────────
// 6. API – Endpoint para obtener usuario actual
//    El frontend lo llama al cargar para saber
//    si hay sesión activa.
// ─────────────────────────────────────────────
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// ─────────────────────────────────────────────
// 7. INICIAR SERVIDOR
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`\n📌 Rutas disponibles:`);
  console.log(`   GET  /              → Login page`);
  console.log(`   GET  /auth/google   → Inicia OAuth con Google`);
  console.log(`   GET  /auth/google/callback → Callback de Google`);
  console.log(`   GET  /auth/logout   → Cierra sesión`);
  console.log(`   GET  /api/me        → Retorna usuario autenticado`);
  console.log(`   GET  /dashboard.html → Dashboard (requiere login)\n`);
});
