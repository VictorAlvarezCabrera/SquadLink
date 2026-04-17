import Link from "next/link";

import type { Clan, CompatibilityResult } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CompatibilityCard({
  clan,
  result,
}: {
  clan: Clan;
  result: CompatibilityResult;
}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-emerald-400/15 text-emerald-200">Compatibilidad</Badge>
          <CardTitle className="text-xl">{clan.name}</CardTitle>
          <p className="text-sm text-slate-300">{clan.tagline}</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Score</p>
          <p className="text-3xl font-semibold">{result.score}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Factor label="Horario" value={result.breakdown.schedule} total={30} />
        <Factor label="Juego y plataforma" value={result.breakdown.gamePlatform} total={25} />
        <Factor label="Rol" value={result.breakdown.roleFit} total={15} />
        <Factor label="Idioma" value={result.breakdown.languageFit} total={15} />
        <Factor label="Fiabilidad" value={result.breakdown.reliability} total={15} />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <p className="text-sm text-slate-300">{result.summary}</p>
        <Link href={`/clanes/${clan.slug}`}>
          <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Ver clan</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function Factor({ label, value, total }: { label: string; value: number; total: number }) {
  const width = Math.round((value / total) * 100);

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>
          {value}/{total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-amber-300" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
