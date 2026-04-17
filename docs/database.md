# Base de datos

## Enfoque

Modelo relacional SQL-first para Supabase PostgreSQL con RLS. El sistema usa `auth.users` como identidad y `profiles` como perfil aplicacional.

## Tablas principales

- `profiles`
  Perfil público y operativo del usuario.
- `games`
  Catálogo de juegos.
- `platforms`
  Catálogo de plataformas.
- `profile_games`
  Relación M:N entre perfil y juego.
- `user_availability`
  Disponibilidad semanal por bloques.
- `clans`
  Clan con juego principal y visibilidad.
- `clan_roles`
  Roles internos configurables por clan.
- `clan_members`
  Membresías y rol operativo.
- `clan_join_requests`
  Solicitudes de ingreso.
- `clan_invitations`
  Invitaciones emitidas por liderazgo.
- `events`
  Eventos del clan o públicos.
- `event_attendees`
  Confirmaciones de asistencia.
- `lfg_posts`
  Publicaciones de búsqueda de grupo.
- `lfg_platforms`
  Plataformas asociadas al anuncio.
- `reviews`
  Valoraciones entre usuarios.
- `reports`
  Reportes moderables.
- `notifications`
  Notificaciones básicas.

## Relaciones

- `profiles.user_id -> auth.users.id`
- `profile_games.profile_id -> profiles.id`
- `profile_games.game_id -> games.id`
- `clans.game_id -> games.id`
- `clans.leader_profile_id -> profiles.id`
- `clan_members.clan_id -> clans.id`
- `clan_members.profile_id -> profiles.id`
- `clan_join_requests` y `clan_invitations` conectan perfiles con clanes
- `events.clan_id -> clans.id`
- `event_attendees.event_id -> events.id`
- `event_attendees.profile_id -> profiles.id`
- `lfg_posts.profile_id -> profiles.id`
- `lfg_posts.game_id -> games.id`
- `lfg_platforms.lfg_post_id -> lfg_posts.id`
- `reviews.author_profile_id -> profiles.id`
- `reviews.target_profile_id -> profiles.id`
- `reports.reporter_profile_id -> profiles.id`

## Índices relevantes

- `profiles.nick` único
- `games.slug` único
- `clans.slug` único
- índices por `game_id`, `leader_profile_id`, `status`, `starts_at`
- índices compuestos en membresías, solicitudes, asistencia y plataformas LFG

## Reglas importantes

- Un usuario tiene un solo perfil aplicacional.
- Un usuario puede pertenecer a varios clanes en el MVP.
- Una solicitud pendiente por usuario y clan.
- Una confirmación de asistencia por usuario y evento.
- Score de review entre 1 y 5.
- Fiabilidad entre 0 y 100.

## Decisiones de diseño

- `user_availability` usa bloques semanales simples para hacer la compatibilidad explicable.
- `clan_roles` se mantiene separada para escalar moderación interna y permisos finos.
- `lfg_platforms` evita arrays opacos cuando se quiera consultar por plataforma.
- `notifications` se mantiene básica para no introducir mensajería compleja en v1.
