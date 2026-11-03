-- AlterTable
ALTER TABLE "DebriefQuestion" ADD COLUMN     "isAllRigs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rigIds" INTEGER[];
