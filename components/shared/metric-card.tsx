import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-300">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
        <p className="mt-2 text-sm text-slate-400">{hint}</p>
      </CardContent>
    </Card>
  );
}
