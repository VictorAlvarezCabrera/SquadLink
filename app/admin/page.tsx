import Link from "next/link";

import { requireRole } from "@/lib/auth/session";
import { listReports } from "@/services/squadlink-service";

import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";

export default async function Page() {
  await requireRole("admin");
  const reports = await listReports();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Administración</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Panel admin</h1>
        </div>
        <Link href="/admin/reportes">
          <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Abrir reportes</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Reportes" value={String(reports.length)} hint="Incidencias registradas en seed demo." />
        <MetricCard label="Abiertos" value={String(reports.filter((report) => report.status === "open").length)} hint="Pendientes de primera revisión." />
        <MetricCard label="En revisión" value={String(reports.filter((report) => report.status === "reviewing").length)} hint="Moderación en curso." />
      </div>
    </div>
  );
}
