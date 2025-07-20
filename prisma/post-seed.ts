import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Find admin user
  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" }
  });

  if (!admin) {
    return;
  }

  // Find category (or create if needed)
  let category = await prisma.category.findUnique({
    where: { slug: "uncategorized" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Uncategorized",
        slug: "uncategorized",
      },
    });
  }

  // Create test posts with categoryId
  await prisma.post.createMany({
    data: [
      {
        title: "Test Post 1",
        slug: "test-post-1",
        content: "<p>This is the first test post.</p>",
        published: true,
        userId: admin.id,
        categoryId: category.id,   // 👈 Category assigned here
      },
      {
        title: "Test Post 2",
        slug: "test-post-2",
        content: "<p>This is the second test post.</p>",
        published: false,
        userId: admin.id,
        categoryId: category.id,
      },
      {
        title: "Another Example Post",
        slug: "example-post",
        content: "<p>Third test post with some more content.</p>",
        published: true,
        userId: admin.id,
        categoryId: category.id,
      },
    ],
  });

  console.log("Seed finished 🎉");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
