"use client";

import { useTransition } from "react";

import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/auth-actions";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      className="text-slate-200 hover:bg-white/10 hover:text-white"
      onClick={() => startTransition(() => void logoutAction())}
      disabled={pending}
    >
      <LogOut />
      Salir
    </Button>
  );
}
