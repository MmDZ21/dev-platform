
import ActiveUsersCard from "@/components/admin/shared/ActiveUsersCard";
import AdminHeroCard from "@/components/admin/shared/AdminHeroCard";
import { StatCard } from "@/components/admin/shared/StatCard";
import AdminBreadcrumb from "@/components/admin/shared/AdminBreadcrumb";
import { appRouter } from "@/lib/trpc";
import { adminModelRegistry } from "@/modules/registry";

export const dynamic = "force-dynamic";

async function fetchCounts() {
  const caller = appRouter.createCaller({} as any);
  return caller.adminStats.getCounts(); // { User: 12, Post: 34, ... }
}

async function fetchActiveSeries() {
  const caller = appRouter.createCaller({} as any);

  // اگر در رجیستری User نداریم، اولین مدل رجیسترشده را استفاده کن
  const modelKey = "User" in adminModelRegistry ? "User" : Object.keys(adminModelRegistry)[0];
  const series = await caller.adminStats.getMonthlyCounts({
    modelKey,
    months: 8,
    dateField: "createdAt", // اگر فیلد تاریخ متفاوت است، اینجا عوض کن
  });
  const activeNow = await caller.adminStats.getActiveNow().catch(() => ({ active: 0 }));
  return { points: series.points, headline: activeNow.active ?? 0 };
}

export default async function DashboardPage() {
  const [counts, series] = await Promise.all([fetchCounts(), fetchActiveSeries()]);

  const statItems = Object.keys(adminModelRegistry)
    .map((key) => {
      const def = (adminModelRegistry as any)[key];
      return { key, label: def?.label ?? key, count: counts[key] ?? 0, order: def?.order ?? 999 };
    })
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Breadcrumb moved to AppHeader */}
      
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <AdminHeroCard />
        <div className="grid gap-6">
          <ActiveUsersCard points={series.points} headline={series.headline} />
          <div className="glass p-4 grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-sm text-white/70">Latest Sales</div>
              <div className="mt-1 text-3xl font-semibold">$ 586</div>
              <div className="mt-1 text-xs text-white/60">Your total earnings</div>
            </div>
            <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
              <div className="size-16 rounded-xl bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((s) => (
          <StatCard key={s.key} label={s.label} value={Intl.NumberFormat().format(s.count)} />
        ))}
      </div>

      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Your top videos in this period</div>
          <button className="chip bg-muted">Popularity ▾</button>
        </div>
        <div className="mt-3 grid gap-3">
          {/* <VideoItem title="Build An Amazing Back Workout" views="16k views" duration="13:21 (17.5%)" />
          <VideoItem title="How to Train the Muscles at Home" views="16k views" duration="17:34 (19.8%)" />
          <VideoItem title="The Ultimate Routine" views="9k views" duration="11:04 (12.1%)" /> */}
        </div>
      </div>
    </div>
  );
}
