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
  await prisma.post.createMany({
    data: [
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
    ],
  });

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

  // Sub-categories
  const subA1 = await prisma.productCategory.create({
    data: {
      name: "کلیدهای مینیاتوری",
      slug: "circuit-breakers",
      parentId: rootA.id,
      order: 1,
    },
  });
  const subA2 = await prisma.productCategory.create({
    data: {
      name: "کنتاکتور",
      slug: "contactors",
      parentId: rootA.id,
      order: 2,
    },
  });
  const subB1 = await prisma.productCategory.create({
    data: {
      name: "PLC",
      slug: "plc",
      parentId: rootB.id,
      order: 1,
    },
  });
  const subB2 = await prisma.productCategory.create({
    data: {
      name: "HMI",
      slug: "hmi",
      parentId: rootB.id,
      order: 2,
    },
  });

  // Sample products
  await prisma.product.createMany({
    data: [
      {
        name: "کلید مینیاتوری 10 آمپر",
        slug: "mcb-10a",
        categoryId: subA1.id,
        imageUrls: [],
        isPublished: true,
        userId: admin.id,
      },
      {
        name: "کنتاکتور 18 آمپر",
        slug: "contactor-18a",
        categoryId: subA2.id,
        imageUrls: [],
        isPublished: true,
        userId: admin.id,
      },
      {
        name: "PLC سری S7-1200",
        slug: "plc-s7-1200",
        categoryId: subB1.id,
        imageUrls: [],
        isPublished: true,
        userId: admin.id,
      },
      {
        name: "پنل لمسی 7 اینچ",
        slug: "hmi-7inch",
        categoryId: subB2.id,
        imageUrls: [],
        isPublished: true,
        userId: admin.id,
      },
    ],
  });

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
