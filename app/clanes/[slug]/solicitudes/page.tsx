import { notFound, redirect } from "next/navigation";

import { resolveClanRequestAction } from "@/app/domain-actions";
import { requireViewer } from "@/lib/auth/session";
import { getClanBySlug, listClanJoinRequests } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const requests = await listClanJoinRequests(clan.slug);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Solicitudes</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Solicitudes para {clan.name}</h1>
      </div>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-white/10 bg-white/5 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{request.profile.nick}</CardTitle>
              <Badge className="bg-amber-400/15 text-amber-100">{request.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">{request.message}</p>
              <div className="flex gap-3">
                <form action={resolveClanRequestAction}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <input type="hidden" name="slug" value={clan.slug} />
                  <input type="hidden" name="decision" value="approve" />
                  <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Aprobar</Button>
                </form>
                <form action={resolveClanRequestAction}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <input type="hidden" name="slug" value={clan.slug} />
                  <input type="hidden" name="decision" value="reject" />
                  <Button variant="outline" className="border-white/10 bg-transparent text-white">Rechazar</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
