/*
  Warnings:

  - You are about to alter the column `slug` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `slug` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `slug` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `slug` on the `ProductCategory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_parentId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'admin';

-- CreateIndex
CREATE INDEX "Product_order_idx" ON "Product"("order");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "ProductCategory_order_idx" ON "ProductCategory"("order");

-- CreateIndex
CREATE INDEX "ProductCategory_parentId_idx" ON "ProductCategory"("parentId");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
