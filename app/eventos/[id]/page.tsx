import { notFound } from "next/navigation";

import { respondAttendanceAction } from "@/app/domain-actions";
import { formatDateTime } from "@/lib/format";
import { getEventById } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Evento</p>
              <CardTitle className="mt-2 text-4xl">{event.title}</CardTitle>
            </div>
            <Badge className="bg-white/10 text-white">{event.game.name}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-300">
          <p>{event.description}</p>
          <p>Fecha: {formatDateTime(event.startsAt)}</p>
          <p>Clan anfitrión: {event.clan.name}</p>
          <p>Plazas: {event.attendeeCount}/{event.capacity}</p>
          <form action={respondAttendanceAction} className="flex flex-wrap gap-3">
            <input type="hidden" name="eventId" value={event.id} />
            <button name="status" value="going" className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950">Asistiré</button>
            <button name="status" value="maybe" className="rounded-lg border border-white/10 px-4 py-2 text-sm">Quizá</button>
            <button name="status" value="declined" className="rounded-lg border border-white/10 px-4 py-2 text-sm">No puedo</button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Asistencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.attendees.map((attendee) => (
            <div key={attendee.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <span>{attendee.profile.nick}</span>
              <Badge className="bg-emerald-400/15 text-emerald-100">{attendee.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
