import Link from "next/link";

import type { Clan } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ClansPage({ clans }: { clans: Clan[] }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Explorador</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Clanes</h1>
          <p className="mt-3 text-slate-300">Listado multijuego con filtros visuales preparados para evolucionar.</p>
        </div>
        <Link href="/clanes/crear">
          <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Crear clan</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {clans.map((clan) => (
          <Card key={clan.id} className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{clan.name}</CardTitle>
                <Badge className="bg-white/10 text-white">{clan.playstyle}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-slate-300">{clan.description}</p>
              <div className="flex flex-wrap gap-2">
                {clan.languages.map((language) => (
                  <Badge key={language} variant="outline" className="border-white/10 text-slate-100">
                    {language.toUpperCase()}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-slate-400">{clan.scheduleSummary}</p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-sm text-slate-300">{clan.memberCount} miembros</span>
              <Link href={`/clanes/${clan.slug}`} className="text-sm font-medium text-amber-300">
                Ver detalle
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
