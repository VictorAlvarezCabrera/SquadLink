import Link from "next/link";

import { registerAction } from "@/app/auth-actions";

import { AuthForm } from "@/components/forms/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Registro</p>
        <h1 className="text-4xl font-semibold text-white">Crea un perfil operativo y empieza a conectar squads.</h1>
        <p className="text-slate-300">En modo demo el registro inicia sesión con un perfil seed preparado para la defensa.</p>
      </div>
      <div className="space-y-4">
        <AuthForm
          title="Crear cuenta"
          description="Registro base con validación Zod y flujo preparado para Supabase Auth."
          action={registerAction}
          submitLabel="Crear cuenta"
          fields={[
            { name: "nick", label: "Nick", type: "text", placeholder: "Tu alias" },
            { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
            { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
          ]}
        />
        <p className="text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-amber-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
