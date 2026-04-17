import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
