-- CreateEnum
CREATE TYPE "ChannelEnum" AS ENUM ('sms', 'email', 'wa');

-- CreateEnum
CREATE TYPE "TimeUnitEnum" AS ENUM ('days', 'hours');

-- CreateTable
CREATE TABLE "nurture_sequences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "clinicId" TEXT NOT NULL,
    "campaignId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nurture_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nurture_steps" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "channel" "ChannelEnum" NOT NULL,
    "wait" INTEGER NOT NULL,
    "unit" "TimeUnitEnum" NOT NULL,
    "message" TEXT NOT NULL,
    "badge" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nurture_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nurture_sequences" ADD CONSTRAINT "nurture_sequences_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurture_sequences" ADD CONSTRAINT "nurture_sequences_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurture_steps" ADD CONSTRAINT "nurture_steps_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "nurture_sequences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
