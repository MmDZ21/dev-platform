/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "createdAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "summary" TEXT;
