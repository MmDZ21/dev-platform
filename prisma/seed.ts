// prisma/seed.ts
import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();
const genSlug = (s: string) =>
  slugify(s, { lower: true, strict: true, locale: "fa" });

async function main() {
  /* ───────── 1) Admin ───────── */
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      role: "admin",
      hashedPassword: await hash("admin123", 10),
      username: "admin",
    },
  });

  /* ───────── 2) Blog sample data ───────── */
  // Categories
  const blogCats = await prisma.category.createMany({
    data: [
      { id: "news",  name: "اخبار",     slug: genSlug("اخبار") },
      { id: "guides", name: "آموزش‌ها", slug: genSlug("آموزش‌ها") },
    ],
    skipDuplicates: true,
  });

  // Tags
  const tags = await prisma.tag.createMany({
    data: [
      { id: "nextjs",   name: "Next.js",   slug: "nextjs" },
      { id: "prisma",   name: "Prisma",    slug: "prisma" },
      { id: "tailwind", name: "Tailwind",  slug: "tailwind" },
    ],
    skipDuplicates: true,
  });

  // Posts
  const postsData = [
    {
      title: "شروع کار با Next.js 15",
      slug: genSlug("شروع کار با Next.js 15"),
      summary: "راهنمای مرحله‌به‌مرحله برای تازه‌کارها",
      content: "محتوای تستی ...",
      categoryId: "guides",
      userId: admin.id,
    },
    {
      title: "Prisma 5 چه ویژگی‌هایی دارد؟",
      slug: genSlug("Prisma 5 چه ویژگی‌هایی دارد"),
      summary: "نگاهی به امکانات جدید",
      content: "محتوای تستی ...",
      categoryId: "news",
      userId: admin.id,
    },
    {
      title: "Tailwind در پروژه‌های بزرگ",
      slug: genSlug("Tailwind در پروژه‌های بزرگ"),
      summary: "Best Practiceها",
      content: "محتوای تستی ...",
      categoryId: "guides",
      userId: admin.id,
    },
  ];
  for (const p of postsData) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // اتصال تگ‌ها به پست اول فقط به‌عنوان نمونه
  const firstPost = await prisma.post.findFirst({ where: { slug: genSlug("شروع کار با Next.js 15") } });
  if (firstPost) {
    await prisma.post.update({
      where: { id: firstPost.id },
      data: {
        tags: { connect: [{ id: "nextjs" }, { id: "tailwind" }] },
      },
    });
  }

  /* ───────── 3) Product catalog ───────── */
  // Root categories
  const rootA = await prisma.productCategory.upsert({
    where: { slug: "electrical-components" },
    update: {},
    create: {
      name: "قطعات الکتریکی",
      slug: "electrical-components",
      order: 1,
    },
  });
  const rootB = await prisma.productCategory.upsert({
    where: { slug: "automation" },
    update: {},
    create: { name: "اتوماسیون", slug: "automation", order: 2 },
  });

  // Sub-categories (idempotent via upsert)
  const subA1 = await prisma.productCategory.upsert({
    where: { slug: "circuit-breakers" },
    update: {},
    create: {
      name: "کلیدهای مینیاتوری",
      slug: "circuit-breakers",
      parentId: rootA.id,
      order: 1,
    },
  });
  const subA2 = await prisma.productCategory.upsert({
    where: { slug: "contactors" },
    update: {},
    create: {
      name: "کنتاکتور",
      slug: "contactors",
      parentId: rootA.id,
      order: 2,
    },
  });
  const subB1 = await prisma.productCategory.upsert({
    where: { slug: "plc" },
    update: {},
    create: {
      name: "PLC",
      slug: "plc",
      parentId: rootB.id,
      order: 1,
    },
  });
  const subB2 = await prisma.productCategory.upsert({
    where: { slug: "hmi" },
    update: {},
    create: {
      name: "HMI",
      slug: "hmi",
      parentId: rootB.id,
      order: 2,
    },
  });

  // Sample products (idempotent via upsert)
  const productsData = [
    { name: "کلید مینیاتوری 10 آمپر", slug: "mcb-10a", categoryId: subA1.id },
    { name: "کنتاکتور 18 آمپر", slug: "contactor-18a", categoryId: subA2.id },
    { name: "PLC سری S7-1200", slug: "plc-s7-1200", categoryId: subB1.id },
    { name: "پنل لمسی 7 اینچ", slug: "hmi-7inch", categoryId: subB2.id },
  ];
  for (const pd of productsData) {
    await prisma.product.upsert({
      where: { slug: pd.slug },
      update: {},
      create: {
        name: pd.name,
        slug: pd.slug,
        categoryId: pd.categoryId,
        imageUrls: [],
        isPublished: true,
        userId: admin.id,
      },
    });
  }

  // اتصال تگ‌ها به یکی از محصولات
  const plc = await prisma.product.findUnique({ where: { slug: "plc-s7-1200" } });
  if (plc) {
    await prisma.product.update({
      where: { id: plc.id },
      data: {
        tags: { connect: [{ id: "prisma" }] },
      },
    });
  }

  /* ───────── 4) CMS: Site and Home page ───────── */
  const siteId = "default";
  await prisma.siteSetting.upsert({
    where: { id: siteId },
    update: {
      activeTheme: "ranin",
    },
    create: {
      id: siteId,
      activeTheme: "ranin",
      defaultLocale: "fa",
      supportedLocales: ["fa", "en"],
      directionByLocale: { fa: "rtl", en: "ltr" },
      baseUrl: "http://localhost:3000",
      metaTitle: "Canvas Dev Platform",
      metaDescription: "Developer-First Modular CMS",
    },
  });

  // Minimal home page (/) in fa
  await prisma.page.upsert({
    where: { locale_path: { locale: "fa", path: "/" } },
    update: {
      title: "خانه",
      layoutKey: "home",
      slots: {
        nav: [
          { type: "ranin.nav", props: { brand: "رانین" } },
        ],
        hero: [
          {
            type: "ranin.hero",
            props: {
              title: "همراه شما در پایداری و کارایی",
              subtitle: "راهکارهای هوشمند برای مدیریت انرژی و اتوماسیون",
              ctaLabel: "بیشتر بدانید",
              ctaHref: "/shop",
              imageUrl: "/images/carousel/carousel-01.png",
            },
          },
        ],
        highlights: [
          {
            type: "ranin.highlightCards",
            props: {
              columns: 3,
              items: [
                { title: "پایداری", description: "تسریع پایداری و شمول", href: "/sustainability" },
                { title: "نرم‌افزار", description: "پرتفوی نرم‌افزار agnostic", href: "/software" },
                { title: "خدمات", description: "آماده‌سازی برای تحول دیجیتال", href: "/services" },
              ],
            },
          },
        ],
        sections: [],
        footer: [
          { type: "ranin.footer", props: { note: "© Ranin Theme 2025" } },
        ]
      },
      metaTitle: "صفحه اصلی",
      metaDescription: "رانین — تم RTL برای صفحه اصلی",
    },
    create: {
      title: "خانه",
      path: "/",
      locale: "fa",
      layoutKey: "home",
      slots: {
        hero: [
          {
            type: "ranin.hero",
            props: {
              title: "همراه شما در پایداری و کارایی",
              subtitle: "راهکارهای هوشمند برای مدیریت انرژی و اتوماسیون",
              ctaLabel: "بیشتر بدانید",
              ctaHref: "/shop",
              imageUrl: "/images/carousel/carousel-01.png",
            },
          },
        ],
        highlights: [
          {
            type: "ranin.highlightCards",
            props: {
              columns: 3,
              items: [
                { title: "پایداری", description: "تسریع پایداری و شمول", href: "/sustainability" },
                { title: "نرم‌افزار", description: "پرتفوی نرم‌افزار agnostic", href: "/software" },
                { title: "خدمات", description: "آماده‌سازی برای تحول دیجیتال", href: "/services" },
              ],
            },
          },
        ],
        sections: [],
      },
      metaTitle: "صفحه اصلی",
      metaDescription: "رانین — تم RTL برای صفحه اصلی",
    },
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
