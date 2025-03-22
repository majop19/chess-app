/*
  Warnings:

  - You are about to drop the column `imageCloudinaryId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_imageCloudinaryId_fkey";

-- DropIndex
DROP INDEX "User_imageCloudinaryId_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageCloudinaryId";

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
