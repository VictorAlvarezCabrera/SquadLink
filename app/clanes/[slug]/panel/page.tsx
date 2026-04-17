import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createEventAction } from "@/app/domain-actions";
import { requireViewer } from "@/lib/auth/session";
import { getClanBySlug, getClanMembers, listClanJoinRequests } from "@/services/squadlink-service";

import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireViewer();
  const { slug } = await params;
  const clan = await getClanBySlug(slug);

  if (!clan) {
    notFound();
  }

  if (viewer.profile.role !== "admin" && viewer.profile.id !== clan.leaderProfileId) {
    redirect(`/clanes/${clan.slug}`);
  }

  const [members, requests] = await Promise.all([getClanMembers(clan.id), listClanJoinRequests(clan.slug)]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Panel de clan</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">{clan.name}</h1>
        </div>
        <Link href={`/clanes/${clan.slug}/solicitudes`}>
          <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Revisar solicitudes</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Miembros" value={String(members.length)} hint="Incluye liderazgo y miembros activos." />
        <MetricCard label="Solicitudes" value={String(requests.length)} hint="Pendientes de revisión." />
        <MetricCard label="Visibilidad" value={clan.visibility} hint="Control público o privado." />
      </div>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Crear evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventAction} className="grid gap-4">
            <input type="hidden" name="clanSlug" value={clan.slug} />
            <Input name="title" className="border-white/10 bg-slate-950/60" placeholder="Título del evento" />
            <Textarea name="description" className="min-h-24 border-white/10 bg-slate-950/60" placeholder="Descripción y objetivo" />
            <Input name="startsAt" type="datetime-local" className="border-white/10 bg-slate-950/60" />
            <Input name="capacity" type="number" defaultValue="5" className="border-white/10 bg-slate-950/60" />
            <Input name="visibility" defaultValue="members_only" className="border-white/10 bg-slate-950/60" />
            <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Publicar evento</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
