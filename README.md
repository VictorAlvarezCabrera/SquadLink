# SquadLink

SquadLink es una plataforma web multijuego para crear clanes, reclutar jugadores, gestionar eventos, publicar LFG, reportar contenido y recomendar clanes compatibles.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- RLS
- Server Actions
- Route Handlers
- Zod
- Vitest

## Estado actual

El frontend existente se mantiene y ahora puede trabajar en dos modos:

- `demo`: usa `data/demo.ts` como fallback local desacoplado.
- `supabase`: usa autenticación real, persistencia real y RLS.

## Instalación

```bash
npm install
```

## Variables de entorno

Consulta `.env.example`.

Variables principales:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_MODE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAWG_API_KEY`
- `CHEAPSHARK_BASE_URL`

## Desarrollo

```bash
npm run dev
```

## Verificación

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Copia `.env.example` a `.env.local`.
3. Rellena URL, anon key y service role key.
4. Cambia `NEXT_PUBLIC_APP_MODE=supabase`.
5. Aplica las migraciones:

```sql
-- Ejecuta en orden:
supabase/migrations/20260417130000_init.sql
supabase/migrations/20260417143000_backend_real.sql
```

6. Carga los seeds:

```sql
supabase/seed/seed.sql
```

## Qué añade la migración backend real

- trigger de bootstrap de `profiles` al registrarse un usuario
- helper `ensure_profile_for_user`
- helper `is_admin`
- helper `is_clan_manager`
- soporte RAWG cache en `games`
- `requirements` en `clans`
- `read_at` y `updated_at` en `notifications`
- índice parcial para evitar múltiples solicitudes pendientes por clan/usuario
- índice parcial para invitaciones pendientes
- endurecimiento de RLS para clanes, eventos, reportes y notificaciones

## Modo demo vs modo real

### Demo

- no requiere Supabase
- permite enseñar flujos y pantallas
- las mutaciones no persisten fuera del runtime

### Supabase

- login y registro reales
- bootstrap de perfil real
- CRUD real de perfil, clanes, solicitudes, eventos, LFG, reportes y notificaciones
- permisos y RLS alineados

## Endpoints implementados

### Perfil

- `GET /api/profile/me`
- `PATCH /api/profile/me`

### Clanes

- `GET /api/clans`
- `GET /api/clans/[slug]`
- `POST /api/clans`
- `PATCH /api/clans/[slug]`

### Solicitudes

- `GET /api/clans/[slug]/join-requests`
- `POST /api/clans/[slug]/join-requests`
- `PATCH /api/clan-requests/[id]`

### Eventos

- `GET /api/events`
- `GET /api/events/[id]`
- `POST /api/clans/[slug]/events`
- `PATCH /api/events/[id]`
- `POST /api/events/[id]/attendance`

### LFG

- `GET /api/lfg`
- `POST /api/lfg`
- `PATCH /api/lfg/[id]`

### Recomendaciones

- `GET /api/recommendations/clans`

### Reportes y admin

- `POST /api/reports`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/[id]`

### Notificaciones

- `GET /api/notifications`
- `PATCH /api/notifications/[id]/read`

### Catálogo externo desacoplado

- `GET /api/catalog/games/search?q=`
- `POST /api/catalog/games/sync`
- `GET /api/offers/game/[slug]`

## Servicios principales

La capa de datos real queda centralizada en `services/`:

- `profile-service.ts`
- `clan-service.ts`
- `event-service.ts`
- `lfg-service.ts`
- `report-service.ts`
- `notification-service.ts`
- `recommendation-service.ts`
- `catalog-service.ts`

`services/squadlink-service.ts` se mantiene como barrel para no romper imports existentes del frontend.

## Flujos operativos

- registro
- login
- bootstrap de perfil
- edición de perfil
- creación y edición de clan
- solicitud de ingreso
- aprobación y rechazo de solicitudes
- creación de evento
- respuesta de asistencia
- publicación de LFG
- creación de reporte
- moderación básica de reportes
- recomendaciones desde datos reales o demo

## Tests

Se cubren:

- validaciones Zod
- lógica de compatibilidad
- render smoke de tarjeta de compatibilidad
- creación de clan
- creación y resolución de solicitud
- creación de evento
- respuesta de asistencia
- creación de LFG
- orden de recomendaciones

## Estructura

```text
app/                Rutas, actions y route handlers
components/         UI y layout
features/           Pantallas y composición visual
services/           Capa de datos y lógica de negocio
lib/                Utilidades, auth y Supabase
validations/        Schemas Zod
data/               Fallback demo
supabase/           Migraciones y seed
tests/              Unit e integration tests
docs/               Arquitectura, base de datos y roadmap
```

## Decisiones técnicas

- Se mantiene el frontend existente y se sustituye la persistencia mock por servicios reales.
- El modo demo no se elimina: queda como fallback explícito.
- La lógica de compatibilidad sigue siendo transparente y reutilizable.
- Las operaciones sensibles usan server actions y/o route handlers sobre la misma capa de servicios.
- El barrel `services/squadlink-service.ts` evita romper imports previos del proyecto.

## Siguiente fase razonable

- formularios más ricos con selects conectados a catálogos
- edición y cierre de LFG con UX dedicada
- aceptación de invitaciones
- reviews persistentes en UI
- notificaciones in-app más completas
- tests de integración contra Supabase local real
