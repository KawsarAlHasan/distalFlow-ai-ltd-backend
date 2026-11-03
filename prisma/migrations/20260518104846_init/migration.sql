/*
  Warnings:

  - You are about to drop the column `whatHappend` on the `DailyDebrief` table. All the data in the column will be lost.
  - You are about to drop the column `whatImproved` on the `DailyDebrief` table. All the data in the column will be lost.
  - You are about to drop the column `whatWorkedWell` on the `DailyDebrief` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyDebrief" DROP COLUMN "whatHappend",
DROP COLUMN "whatImproved",
DROP COLUMN "whatWorkedWell",
ADD COLUMN     "questionAnswer" JSONB;
