import Link from "next/link";

import { formatDateTime } from "@/lib/format";
import { getDashboardSnapshot } from "@/services/squadlink-service";

import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function DashboardPage({ profileId }: { profileId: string }) {
  const snapshot = await getDashboardSnapshot(profileId);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Dashboard</p>
        <h1 className="text-4xl font-semibold text-white">Hola, {snapshot.profile.nick}</h1>
        <p className="text-slate-300">Vista resumida de tu actividad en clanes, eventos y reputación.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Clanes activos" value={String(snapshot.memberships.length)} hint="Membresías actuales dentro del MVP." />
        <MetricCard label="Próximos eventos" value={String(snapshot.upcomingEvents.length)} hint="Eventos vinculados a tus clanes." />
        <MetricCard label="Fiabilidad" value={`${snapshot.profile.reliabilityScore}`} hint="Puntuación usada para recomendaciones." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos eventos</CardTitle>
            <Link href="/eventos">
              <Button variant="outline" className="border-white/10 bg-transparent text-white">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-slate-300">{formatDateTime(event.startsAt)}</p>
                  </div>
                  <Badge className="bg-amber-400/15 text-amber-100">{event.attendeeCount}/{event.capacity}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Solicitudes abiertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.openRequests.length === 0 ? (
              <p className="text-sm text-slate-300">No tienes solicitudes pendientes.</p>
            ) : (
              snapshot.openRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="font-medium">{request.message}</p>
                  <p className="mt-2 text-sm text-slate-300">Estado: {request.status}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
