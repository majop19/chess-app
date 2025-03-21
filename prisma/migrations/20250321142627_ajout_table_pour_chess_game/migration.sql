/*
  Warnings:

  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageCloudinaryId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publicId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropIndex
DROP INDEX "Image_userId_idx";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "userId",
ALTER COLUMN "publicId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageCloudinaryId" TEXT;

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "whiteId" TEXT NOT NULL,
    "blackId" TEXT NOT NULL,
    "winner" TEXT,
    "timeControl" TEXT NOT NULL,
    "isRated" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "turn" TEXT NOT NULL DEFAULT 'white',
    "pgn" TEXT,
    "boardState" TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    "castlingRights" TEXT NOT NULL DEFAULT 'KQkq',
    "enPassantTarget" TEXT,
    "halfMoveClock" INTEGER NOT NULL DEFAULT 0,
    "fullMoveNumber" INTEGER NOT NULL DEFAULT 1,
    "whiteTime" INTEGER,
    "blackTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "moveNumber" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "notation" TEXT NOT NULL,
    "fromSquare" TEXT NOT NULL,
    "toSquare" TEXT NOT NULL,
    "capturedPiece" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Move_gameId_idx" ON "Move"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "User_imageCloudinaryId_key" ON "User"("imageCloudinaryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageCloudinaryId_fkey" FOREIGN KEY ("imageCloudinaryId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
