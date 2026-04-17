import Link from "next/link";

import { getViewer } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

import { LogoutButton } from "@/components/shared/logout-button";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/clanes", label: "Clanes" },
  { href: "/eventos", label: "Eventos" },
  { href: "/lfg", label: "LFG" },
  { href: "/recomendaciones", label: "Compatibilidad" },
];

export async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25">
              SL
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">SquadLink</p>
              <p className="text-xs text-slate-400">Clanes, squads y eventos</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {viewer ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  Entrar
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">Crear cuenta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
