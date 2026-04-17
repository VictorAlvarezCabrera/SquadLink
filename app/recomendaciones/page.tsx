import { requireViewer } from "@/lib/auth/session";
import { getRecommendations } from "@/services/squadlink-service";

import { CompatibilityCard } from "@/components/shared/compatibility-card";

export default async function Page() {
  const viewer = await requireViewer();
  const recommendations = await getRecommendations(viewer.profile.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Compatibilidad</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Recomendaciones para {viewer.profile.nick}</h1>
        <p className="mt-3 text-slate-300">La fórmula usa horario 30%, juego y plataforma 25%, rol 15%, idioma 15% y fiabilidad 15%.</p>
      </div>
      <div className="space-y-6">
        {recommendations.map((entry) => (
          <CompatibilityCard key={entry.clan.id} clan={entry.clan} result={entry.result} />
        ))}
      </div>
    </div>
  );
}
