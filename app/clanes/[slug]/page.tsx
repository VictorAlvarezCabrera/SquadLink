import Link from "next/link";
import { notFound } from "next/navigation";

import { createClanJoinRequestAction, createReportAction } from "@/app/domain-actions";
import { getClanBySlug, getClanMembers } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clan = await getClanBySlug(slug);

  if (!clan) {
    notFound();
  }

  const members = await getClanMembers(clan.id);

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Clan</p>
              <CardTitle className="mt-2 text-4xl">{clan.name}</CardTitle>
              <p className="mt-3 max-w-3xl text-slate-300">{clan.description}</p>
            </div>
            <Badge className="bg-white/10 text-white">{clan.playstyle}</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/clanes/${clan.slug}/editar`}>
              <Button variant="outline" className="border-white/10 bg-transparent text-white">Editar</Button>
            </Link>
            <Link href={`/clanes/${clan.slug}/panel`}>
              <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Abrir panel</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <Block title="Idiomas" values={clan.languages} />
          <Block title="Plataformas" values={clan.preferredPlatforms} />
          <Block title="Roles abiertos" values={clan.openRoles} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Solicitar ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createClanJoinRequestAction} className="space-y-4">
              <input type="hidden" name="slug" value={clan.slug} />
              <Textarea name="message" className="min-h-28 border-white/10 bg-slate-950/60" placeholder="Explica por qué encajas con el clan." />
              <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Enviar solicitud</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Reportar clan</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createReportAction} className="space-y-4">
              <input type="hidden" name="targetType" value="clan" />
              <input type="hidden" name="targetId" value={clan.id} />
              <Input name="reason" className="border-white/10 bg-slate-950/60" placeholder="Motivo breve" />
              <Textarea name="details" className="min-h-28 border-white/10 bg-slate-950/60" placeholder="Describe la incidencia." />
              <Button variant="outline" className="border-white/10 bg-transparent text-white">Crear reporte</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Miembros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {members.map((member: (typeof members)[number]) => (
            <div key={member.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="font-medium">{member.profile.nick}</p>
              <p className="text-sm text-slate-300">{member.role}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Block({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant="outline" className="border-white/10 text-slate-100">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
