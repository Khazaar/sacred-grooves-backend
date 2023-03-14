/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `telegramName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Artist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `style` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Artist_nickName_key";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "nickName",
DROP COLUMN "passwordHash",
DROP COLUMN "telegramName",
DROP COLUMN "updatedAt",
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "telegramName" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickName_key" ON "User"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
