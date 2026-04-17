import type { ReactNode } from "react";

import { createClanAction } from "@/app/domain-actions";
import { requireViewer } from "@/lib/auth/session";
import { getCatalog } from "@/services/catalog-service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function Page() {
  await requireViewer();
  const catalog = await getCatalog();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Nuevo clan</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Crear clan</h1>
      </div>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Formulario base del clan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClanAction} className="grid gap-5">
            <Field label="Nombre"><Input name="name" className="border-white/10 bg-slate-950/60" placeholder="Nightwatch Protocol" /></Field>
            <Field label="Tagline"><Input name="tagline" className="border-white/10 bg-slate-950/60" placeholder="Qué os hace distintos" /></Field>
            <Field label="Descripción"><Textarea name="description" className="min-h-32 border-white/10 bg-slate-950/60" placeholder="Objetivo, tono y ritmo del clan" /></Field>
            <Field label="Juego principal"><Input name="gameId" defaultValue={catalog.games[0]?.id ?? ""} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Visibilidad"><Input name="visibility" defaultValue="public" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Playstyle"><Input name="playstyle" defaultValue="competitive" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Horario"><Input name="scheduleSummary" placeholder="Martes y jueves 21:00-23:30" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Idiomas (csv)"><Input name="languages" defaultValue="es, en" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Plataformas (csv)"><Input name="preferredPlatforms" defaultValue="pc" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Requisitos (csv)"><Input name="requirements" defaultValue="Discord, Puntualidad" className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Roles abiertos (csv)"><Input name="openRoles" defaultValue="support" className="border-white/10 bg-slate-950/60" /></Field>
            <Button className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300">Crear clan</Button>
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
