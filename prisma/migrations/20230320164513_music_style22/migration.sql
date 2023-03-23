/*
  Warnings:

  - A unique constraint covering the columns `[musicStyleName]` on the table `MusicStyle` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MusicStyle_artistId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MusicStyle_musicStyleName_key" ON "MusicStyle"("musicStyleName");
