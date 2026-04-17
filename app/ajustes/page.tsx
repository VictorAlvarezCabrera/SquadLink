import { requireViewer } from "@/lib/auth/session";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
  const viewer = await requireViewer();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Ajustes</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Configuración de {viewer.profile.nick}</h1>
      </div>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Preferencias y seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-300">
          <p>La estructura queda preparada para notificaciones, privacidad y gestión de cuenta.</p>
          <p>En la fase actual se documenta como módulo listo para extensión sin introducir complejidad innecesaria.</p>
        </CardContent>
      </Card>
    </div>
  );
}
