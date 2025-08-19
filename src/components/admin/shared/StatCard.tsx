export function StatCard({
  label,
  value,
  trend,
}: { label: string; value: string | number; trend?: number }) {
  return (
    <div className="stat">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        {typeof trend === "number" && (
          <span className="chip bg-muted text-foreground/80">{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%</span>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}