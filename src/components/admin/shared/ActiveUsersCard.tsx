"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";

const config: ChartConfig = {
  users: { label: "Active Users", color: "var(--color-brand-500)" },
  accent: { label: "Accent", color: "var(--color-accent)" },
};

export type SeriesPoint = { label: string; value: number };

export default function ActiveUsersCard({ points, headline }: { points: SeriesPoint[]; headline?: number; }) {
  const data = points?.length ? points : [];
  const last = data.at(-1)?.value ?? 0;

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Active users right now</div>
        <div className="chip bg-muted text-foreground/80">{headline ?? last}</div>
      </div>

      <div className="mt-2 h-36">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={28} />
              <ChartTooltip />
              <Line type="monotone" dataKey="value" stroke="var(--color-users)" strokeWidth={2} dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-users)" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
