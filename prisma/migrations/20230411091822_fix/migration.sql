/*
  Warnings:

  - You are about to drop the column `artisitTypeName` on the `ArtistType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[artistTypeName]` on the table `ArtistType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistTypeName` to the `ArtistType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ArtistType_artisitTypeName_key";

-- AlterTable
ALTER TABLE "ArtistType" DROP COLUMN "artisitTypeName",
ADD COLUMN     "artistTypeName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ArtistType_artistTypeName_key" ON "ArtistType"("artistTypeName");
