import { recoverAccessAction } from "@/app/auth-actions";

import { AuthForm } from "@/components/forms/auth-form";

export default function RecoverAccessPage() {
  return (
    <div className="mx-auto max-w-xl py-10">
      <AuthForm
        title="Recuperar acceso"
        description="Solicita el envío de un correo para restablecer la contraseña."
        action={recoverAccessAction}
        submitLabel="Enviar enlace"
        fields={[{ name: "email", label: "Email", type: "email", placeholder: "tu@email.com" }]}
      />
    </div>
  );
}
