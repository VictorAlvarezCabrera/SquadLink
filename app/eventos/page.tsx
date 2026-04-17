import Link from "next/link";

import { formatDateTime } from "@/lib/format";
import { listEvents } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
  const events = await listEvents();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Agenda</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Eventos</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <Link href={`/eventos/${event.id}`} key={event.id}>
            <Card className="h-full border-white/10 bg-white/5 text-white transition hover:border-amber-300/40">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{event.title}</CardTitle>
                  <Badge className="bg-white/10 text-white">{event.game.name}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">{event.description}</p>
                <p className="text-sm text-slate-400">{formatDateTime(event.startsAt)}</p>
                <p className="text-sm text-slate-400">{event.clan.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
