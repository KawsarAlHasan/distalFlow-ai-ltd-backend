-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_activityId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_companyId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_rigId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_typeOfDevriefId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_userId_fkey";

-- AlterTable
ALTER TABLE "DailyDebrief" ADD COLUMN     "submitDay" TEXT,
ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "rigId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "activityId" DROP NOT NULL,
ALTER COLUMN "typeOfDevriefId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyDebrief" ADD CONSTRAINT "DailyDebrief_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDebrief" ADD CONSTRAINT "DailyDebrief_rigId_fkey" FOREIGN KEY ("rigId") REFERENCES "Rig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDebrief" ADD CONSTRAINT "DailyDebrief_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDebrief" ADD CONSTRAINT "DailyDebrief_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDebrief" ADD CONSTRAINT "DailyDebrief_typeOfDevriefId_fkey" FOREIGN KEY ("typeOfDevriefId") REFERENCES "TypeOfDevrief"("id") ON DELETE SET NULL ON UPDATE CASCADE;
