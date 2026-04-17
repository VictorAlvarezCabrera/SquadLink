import { updateReportStatusAction } from "@/app/domain-actions";
import { requireRole } from "@/lib/auth/session";
import { listReports } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function Page() {
  await requireRole("admin");
  const reports = await listReports();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Moderación</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Reportes</h1>
      </div>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="border-white/10 bg-white/5 text-white">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>{report.reason}</CardTitle>
              <Badge className="bg-amber-400/15 text-amber-100">{report.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>Reporter: {report.reporter.nick}</p>
              <p>Objetivo: {report.targetType}</p>
              <p>{report.details}</p>
              <form action={updateReportStatusAction} className="flex gap-3">
                <input type="hidden" name="reportId" value={report.id} />
                <Input name="status" defaultValue={report.status} className="max-w-xs border-white/10 bg-slate-950/60" />
                <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Actualizar estado</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
