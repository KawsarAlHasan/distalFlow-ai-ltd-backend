-- AlterTable
ALTER TABLE "ClinicAdmin" ADD COLUMN     "isMainAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onTimePassword" TEXT,
ADD COLUMN     "password" TEXT;
