import type { ReactNode } from "react";

import { notFound, redirect } from "next/navigation";

import { updateClanAction } from "@/app/domain-actions";
import { requireViewer } from "@/lib/auth/session";
import { getClanBySlug } from "@/services/squadlink-service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Editar {clan.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateClanAction} className="grid gap-5">
            <input type="hidden" name="slug" value={clan.slug} />
            <Field label="Nombre"><Input name="name" defaultValue={clan.name} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Tagline"><Input name="tagline" defaultValue={clan.tagline} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Descripción"><Textarea name="description" defaultValue={clan.description} className="min-h-36 border-white/10 bg-slate-950/60" /></Field>
            <Field label="Juego id"><Input name="gameId" defaultValue={clan.gameId} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Visibilidad"><Input name="visibility" defaultValue={clan.visibility} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Playstyle"><Input name="playstyle" defaultValue={clan.playstyle} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Horario"><Input name="scheduleSummary" defaultValue={clan.scheduleSummary} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Idiomas (csv)"><Input name="languages" defaultValue={clan.languages.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Plataformas (csv)"><Input name="preferredPlatforms" defaultValue={clan.preferredPlatforms.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Requisitos (csv)"><Input name="requirements" defaultValue={clan.requirements.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Roles abiertos (csv)"><Input name="openRoles" defaultValue={clan.openRoles.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-200">{label}</Label>
      {children}
    </div>
  );
}
