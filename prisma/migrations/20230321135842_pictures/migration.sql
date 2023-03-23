-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "posterPictureId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarPictureId" INTEGER;

-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "pictureS3Url" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarPictureId_fkey" FOREIGN KEY ("avatarPictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_posterPictureId_fkey" FOREIGN KEY ("posterPictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
