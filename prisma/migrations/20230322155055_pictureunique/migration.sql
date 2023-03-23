/*
  Warnings:

  - A unique constraint covering the columns `[posterPictureId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarPictureId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_posterPictureId_key" ON "Event"("posterPictureId");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarPictureId_key" ON "User"("avatarPictureId");
