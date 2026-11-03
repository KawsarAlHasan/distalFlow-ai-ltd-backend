-- CreateTable
CREATE TABLE "AppHome" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER,
    "videoId" INTEGER,
    "companyId" INTEGER,
    "rigId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppHome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppHome" ADD CONSTRAINT "AppHome_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppHome" ADD CONSTRAINT "AppHome_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppHome" ADD CONSTRAINT "AppHome_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppHome" ADD CONSTRAINT "AppHome_rigId_fkey" FOREIGN KEY ("rigId") REFERENCES "Rig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
