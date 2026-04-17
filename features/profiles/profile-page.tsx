import { formatReliability } from "@/lib/format";
import type { Profile } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage({ profile, editable = false }: { profile: Profile; editable?: boolean }) {
  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Perfil de jugador</p>
              <CardTitle className="mt-2 text-4xl">{profile.nick}</CardTitle>
              <p className="mt-3 max-w-2xl text-slate-300">{profile.bio}</p>
            </div>
            {editable ? <Badge className="bg-amber-400/15 text-amber-100">Edición habilitada</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <Info title="Idiomas" values={profile.languages} />
          <Info title="Roles" values={profile.gameplayRoles} />
          <Info title="Disponibilidad" values={profile.availability.map((slot) => `${slot.day} ${slot.from}-${slot.to}`)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Plataforma principal" value={profile.mainPlatform} />
        <Summary label="Fiabilidad" value={formatReliability(profile.reliabilityScore)} />
        <Summary label="Zona horaria" value={profile.timezone} />
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardContent className="p-6">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Info({ title, values }: { title: string; values: string[] }) {
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
