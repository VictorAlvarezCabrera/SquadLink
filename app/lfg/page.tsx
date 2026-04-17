import { createLfgAction } from "@/app/domain-actions";
import { formatDateTime } from "@/lib/format";
import { listLfgPosts } from "@/services/squadlink-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function Page() {
  const posts = await listLfgPosts();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Looking For Group</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">LFG</h1>
      </div>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Publicar LFG</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createLfgAction} className="grid gap-4">
            <Input name="gameId" className="border-white/10 bg-slate-950/60" placeholder="ID del juego" />
            <Input name="title" className="border-white/10 bg-slate-950/60" placeholder="Título" />
            <Textarea name="description" className="min-h-24 border-white/10 bg-slate-950/60" placeholder="Qué buscas y a qué hora." />
            <Input name="platforms" defaultValue="pc" className="border-white/10 bg-slate-950/60" placeholder="Plataformas csv" />
            <Input name="desiredRoles" defaultValue="support" className="border-white/10 bg-slate-950/60" placeholder="Roles csv" />
            <Input name="languages" defaultValue="es" className="border-white/10 bg-slate-950/60" placeholder="Idiomas csv" />
            <Input name="expiresAt" type="datetime-local" className="border-white/10 bg-slate-950/60" />
            <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Publicar</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{post.title}</CardTitle>
                <Badge className="bg-emerald-400/15 text-emerald-100">{post.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-slate-300">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="border-white/10 text-slate-100">
                    {platform}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-slate-400">Caduca: {formatDateTime(post.expiresAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
