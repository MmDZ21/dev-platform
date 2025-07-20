import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { name: "Uncategorized" },
    update: {},
    create: { name: "Uncategorized", slug: "uncategorized" },
  });

  await prisma.category.upsert({
    where: { name: "News" },
    update: {},
    create: { name: "News", slug: "news" },
  });

  await prisma.category.upsert({
    where: { name: "Tutorial" },
    update: {},
    create: { name: "Tutorial", slug: "tutorial" },
  });

  console.log("Category seed done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
