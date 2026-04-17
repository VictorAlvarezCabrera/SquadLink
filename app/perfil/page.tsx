import type { ReactNode } from "react";

import { updateProfileAction } from "@/app/domain-actions";
import { requireViewer } from "@/lib/auth/session";
import { ProfilePage } from "@/features/profiles/profile-page";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function Page() {
  const viewer = await requireViewer();

  return (
    <div className="space-y-8">
      <ProfilePage profile={viewer.profile} editable />
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Editar perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="grid gap-5 md:grid-cols-2">
            <Field label="Nick"><Input name="nick" defaultValue={viewer.profile.nick} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Nombre completo"><Input name="fullName" defaultValue={viewer.profile.fullName} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Plataforma principal"><Input name="mainPlatform" defaultValue={viewer.profile.mainPlatform} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Zona horaria"><Input name="timezone" defaultValue={viewer.profile.timezone} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Idiomas (csv)"><Input name="languages" defaultValue={viewer.profile.languages.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Roles (csv)"><Input name="gameplayRoles" defaultValue={viewer.profile.gameplayRoles.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Juegos favoritos ids (csv)"><Input name="favoriteGameIds" defaultValue={viewer.profile.favoriteGameIds.join(", ")} className="border-white/10 bg-slate-950/60" /></Field>
            <Field label="Fiabilidad"><Input name="reliabilityScore" type="number" defaultValue={String(viewer.profile.reliabilityScore)} className="border-white/10 bg-slate-950/60" /></Field>
            <div className="md:col-span-2">
              <Field label="Bio"><Textarea name="bio" defaultValue={viewer.profile.bio} className="min-h-28 border-white/10 bg-slate-950/60" /></Field>
            </div>
            <div className="md:col-span-2">
              <Button className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300">Guardar perfil</Button>
            </div>
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
