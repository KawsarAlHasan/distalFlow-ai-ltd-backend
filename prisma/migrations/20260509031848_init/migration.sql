-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_rigId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_userId_fkey";

-- AlterTable
ALTER TABLE "CardSubmission" ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "rigId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameResult" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "rigId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CardSubmission" ADD CONSTRAINT "CardSubmission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSubmission" ADD CONSTRAINT "CardSubmission_rigId_fkey" FOREIGN KEY ("rigId") REFERENCES "Rig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSubmission" ADD CONSTRAINT "CardSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_rigId_fkey" FOREIGN KEY ("rigId") REFERENCES "Rig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
