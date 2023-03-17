-- CreateTable
CREATE TABLE "ArtistType" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "ArtistType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicStyle" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "MusicStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTeam" (
    "id" SERIAL NOT NULL,
    "supportTeamId" INTEGER NOT NULL,

    CONSTRAINT "SupportTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistType_artistId_key" ON "ArtistType"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicStyle_artistId_key" ON "MusicStyle"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTeam_supportTeamId_key" ON "SupportTeam"("supportTeamId");

-- AddForeignKey
ALTER TABLE "ArtistType" ADD CONSTRAINT "ArtistType_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStyle" ADD CONSTRAINT "MusicStyle_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTeam" ADD CONSTRAINT "SupportTeam_supportTeamId_fkey" FOREIGN KEY ("supportTeamId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
