import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/core";
import { adminModelRegistry } from "@/modules/registry";
import { modelPrismaMap } from "@/modules/prismaMap";

// کمکی: delegate مربوط به هر مدل را پیدا می‌کند (user / users ...)
function getDelegate(modelKey: string) {
  const mapAny = modelPrismaMap as Record<string, any>;
  if (mapAny[modelKey]) return mapAny[modelKey];
  const lc = modelKey.toLowerCase();
  if (mapAny[lc]) return mapAny[lc];
  const plural = `${lc}s`;
  if (mapAny[plural]) return mapAny[plural];
  return undefined;
}

// کمکی: انتهای ماه بعدی
function addMonths(d: Date, n: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export const adminStatsRouter = router({
  // شمارش تمام مدل‌های رجیسترشده (برای کارت‌های 4تایی)
  getCounts: publicProcedure.query(async () => {
    const entries = await Promise.all(
      Object.keys(adminModelRegistry).map(async (key) => {
        const delegate = getDelegate(key);
        const c =
          typeof delegate?.count === "function" ? await delegate.count() : 0;
        return [key, c] as const;
      })
    );
    return Object.fromEntries(entries) as Record<string, number>;
  }),

  // سری ماهانه (برای چارت خطی) بر اساس createdAt یا فیلد تاریخِ دلخواه
  getMonthlyCounts: publicProcedure
    .input(
      z.object({
        modelKey: z.string().default("User"),
        months: z.number().int().min(1).max(24).default(8),
        dateField: z.string().default("createdAt"),
      })
    )
    .query(async ({ input }) => {
      const { modelKey, months, dateField } = input;
      const delegate = getDelegate(modelKey);
      if (!delegate) {
        return { modelKey, points: [] as { label: string; value: number }[] };
      }

      const end = startOfMonth(new Date()); // ابتدای ماه جاری
      const start = addMonths(end, -months + 1);

      const points: { label: string; value: number }[] = [];
      for (let i = 0; i < months; i++) {
        const from = addMonths(start, i);
        const to = addMonths(from, 1);
        const label = from.toLocaleString(undefined, { month: "short" });
        let value = 0;
        try {
          value = await delegate.count({
            where: {
              [dateField]: {
                gte: from,
                lt: to,
              },
            },
          });
        } catch {
          // اگر مدل/فیلد تاریخ موجود نبود، صفر می‌ماند
          value = 0;
        }
        points.push({ label, value });
      }

      return { modelKey, points };
    }),

  // (اختیاری) کاربران/سشن‌های فعال در 60 دقیقه اخیر اگر Session موجود باشد
  getActiveNow: publicProcedure.query(async () => {
    const mapAny = modelPrismaMap as Record<string, any>;
    const session =
      mapAny.Session || mapAny.session || mapAny.authSession || undefined;
    if (!session) return { active: 0 };

    const now = new Date();
    const ago = new Date(now.getTime() - 60 * 60 * 1000);

    // تلاش برای چند نام متداولِ فیلد تاریخ انقضا/آپدیت
    const where =
      "expiresAt" in session
        ? { expiresAt: { gt: now } }
        : "activeExpires" in session
        ? { activeExpires: { gt: now.getTime() } }
        : "updatedAt" in session
        ? { updatedAt: { gt: ago } }
        : undefined;

    if (!where) return { active: 0 };

    const active = await session.count({ where });
    return { active };
  }),
});
