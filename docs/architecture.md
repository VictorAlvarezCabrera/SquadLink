# Arquitectura de SquadLink

## Objetivo

SquadLink se plantea como una aplicación web multijuego orientada a coordinación y reclutamiento. El diseño evita complejidad innecesaria y separa presentación, lógica de negocio y persistencia.

## Capas

1. `app/`
   App Router de Next.js. Define rutas, layouts, middleware y server actions de autenticación.
2. `features/`
   Composición visual por dominio: landing, dashboard, perfiles, clanes y administración.
3. `components/`
   Layout global, formularios y componentes reutilizables con `shadcn/ui`.
4. `services/`
   Casos de uso y agregación de datos. En el MVP usan datos demo y quedan preparados para reemplazar por repositorios Supabase.
5. `lib/`
   Utilidades transversales: auth, Supabase SSR, compatibilidad y formateo.
6. `validations/`
   Esquemas Zod compartidos por cliente y servidor.
7. `supabase/`
   Migraciones SQL, RLS y seed.

## Decisiones clave

- Se usa `App Router` con componentes servidor por defecto para reducir hidratación innecesaria.
- Se incluye `demo mode` para defensa académica sin depender de una instancia externa.
- La compatibilidad jugador-clan vive en un helper puro y testeable.
- La persistencia se diseña SQL-first para encajar bien con Supabase y RLS.
- El MVP permite múltiples membresías a clanes. Es útil en plataforma multijuego y evita una restricción artificial por usuario.

## Módulos funcionales

- Auth y sesión
- Perfil de jugador
- Catálogo de juegos y plataformas
- Clanes, miembros, solicitudes e invitaciones
- Eventos y asistencia
- Publicaciones LFG
- Reviews y reputación
- Reportes y administración
- Recomendaciones

## Flujo de datos

1. La ruta del `app/` pide datos al servicio.
2. El servicio resuelve contra demo data o puede evolucionar a consultas Supabase.
3. Las mutaciones críticas usan server actions + validación Zod.
4. En producción académica, RLS replica la autorización en base de datos.

## Seguridad

- Middleware para proteger rutas privadas en modo demo.
- `requireViewer` y `requireRole` en servidor.
- Validación con Zod.
- RLS por tabla sensible.
- Restricciones SQL, checks, índices y uniques.
