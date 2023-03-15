-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
