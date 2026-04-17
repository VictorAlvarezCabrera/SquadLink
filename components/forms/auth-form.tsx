"use client";

import { useActionState } from "react";

import type { FormState } from "@/app/auth-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({
  title,
  description,
  action,
  fields,
  submitLabel,
}: {
  title: string;
  description: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Array<{ name: string; label: string; type: string; placeholder: string }>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-slate-300">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          {fields.map((field) => (
            <div className="space-y-2" key={field.name}>
              <Label htmlFor={field.name} className="text-slate-200">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="border-white/10 bg-slate-950/70 text-white"
              />
            </div>
          ))}
          {state.message ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {state.message}
            </div>
          ) : null}
          <Button type="submit" className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300" disabled={pending}>
            {pending ? "Procesando..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
