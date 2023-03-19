/*
  Warnings:

  - A unique constraint covering the columns `[auth0sub]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth0sub" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0sub_key" ON "User"("auth0sub");
