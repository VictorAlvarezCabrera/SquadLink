import Link from "next/link";

import { loginAction } from "@/app/auth-actions";

import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Acceso</p>
        <h1 className="text-4xl font-semibold text-white">Entra en tu panel de clanes y eventos.</h1>
        <p className="text-slate-300">En modo demo puedes usar `lyra@squadlink.gg` o `admin@squadlink.gg` con contraseña `demo12345`.</p>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
          <p>Rutas privadas protegidas: dashboard, perfil, recomendaciones, ajustes y administración.</p>
        </div>
      </div>
      <div className="space-y-4">
        <AuthForm
          title="Iniciar sesión"
          description="Autenticación con Supabase o cookie demo local."
          action={loginAction}
          submitLabel="Entrar"
          fields={[
            { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
            { name: "password", label: "Contraseña", type: "password", placeholder: "••••••••" },
          ]}
        />
        <p className="text-sm text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-amber-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
