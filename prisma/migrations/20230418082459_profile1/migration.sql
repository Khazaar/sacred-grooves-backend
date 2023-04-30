-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "auth0sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "telegramName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatarPictureId" INTEGER,
    "locationId" INTEGER,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "mainLocation" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ogranizerId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "visitorsId" INTEGER,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "posterPictureId" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistType" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER,
    "artistTypeName" TEXT NOT NULL,

    CONSTRAINT "ArtistType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicStyle" (
    "id" SERIAL NOT NULL,
    "musicStyleName" TEXT NOT NULL,
    "artistId" INTEGER,

    CONSTRAINT "MusicStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTeam" (
    "id" SERIAL NOT NULL,
    "supportTeamId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "SupportTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "pictureS3Url" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,

    CONSTRAINT "MapLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_auth0sub_key" ON "Profile"("auth0sub");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarPictureId_key" ON "User"("avatarPictureId");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_profileId_key" ON "Artist"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_userId_key" ON "organizer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_profileId_key" ON "organizer"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_profileId_key" ON "Visitor"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_posterPictureId_key" ON "Event"("posterPictureId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistType_artistTypeName_key" ON "ArtistType"("artistTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "MusicStyle_musicStyleName_key" ON "MusicStyle"("musicStyleName");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTeam_supportTeamId_key" ON "SupportTeam"("supportTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTeam_profileId_key" ON "SupportTeam"("profileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MapLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarPictureId_fkey" FOREIGN KEY ("avatarPictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer" ADD CONSTRAINT "organizer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ogranizerId_fkey" FOREIGN KEY ("ogranizerId") REFERENCES "organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MapLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_posterPictureId_fkey" FOREIGN KEY ("posterPictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistType" ADD CONSTRAINT "ArtistType_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStyle" ADD CONSTRAINT "MusicStyle_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTeam" ADD CONSTRAINT "SupportTeam_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
