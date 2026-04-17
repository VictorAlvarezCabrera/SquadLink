import { format } from "date-fns";

export function formatDateTime(value: string) {
  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

export function formatReliability(score: number) {
  return `${score}/100`;
}
