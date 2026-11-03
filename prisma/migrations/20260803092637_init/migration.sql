/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppHome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyDebrief` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DebriefQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hazard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Heatmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HeatmapArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Puzzle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionAnwser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RigAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RigType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeOfDevrief` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Videos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToRig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CouponToPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RigToTypeOfDevrief` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AppHome" DROP CONSTRAINT "AppHome_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AppHome" DROP CONSTRAINT "AppHome_messageId_fkey";

-- DropForeignKey
ALTER TABLE "AppHome" DROP CONSTRAINT "AppHome_rigId_fkey";

-- DropForeignKey
ALTER TABLE "AppHome" DROP CONSTRAINT "AppHome_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_areaId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_cardTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_hazardId_fkey";

-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_rigId_fkey";

-- DropForeignKey
ALTER TABLE "CardType" DROP CONSTRAINT "CardType_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_rigId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_activityId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_companyId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_rigId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_typeOfDevriefId_fkey";

-- DropForeignKey
ALTER TABLE "DebriefQuestion" DROP CONSTRAINT "DebriefQuestion_companyId_fkey";

-- DropForeignKey
ALTER TABLE "DebriefQuestion" DROP CONSTRAINT "DebriefQuestion_rigId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_companyId_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_companyId_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_rigId_fkey";

-- DropForeignKey
ALTER TABLE "Hazard" DROP CONSTRAINT "Hazard_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Heatmap" DROP CONSTRAINT "Heatmap_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Heatmap" DROP CONSTRAINT "Heatmap_rigId_fkey";

-- DropForeignKey
ALTER TABLE "HeatmapArea" DROP CONSTRAINT "HeatmapArea_areaId_fkey";

-- DropForeignKey
ALTER TABLE "HeatmapArea" DROP CONSTRAINT "HeatmapArea_heatmapId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Rig" DROP CONSTRAINT "Rig_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Rig" DROP CONSTRAINT "Rig_rigTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RigAdmin" DROP CONSTRAINT "RigAdmin_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RigAdmin" DROP CONSTRAINT "RigAdmin_rigId_fkey";

-- DropForeignKey
ALTER TABLE "RigType" DROP CONSTRAINT "RigType_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "TypeOfDevrief" DROP CONSTRAINT "TypeOfDevrief_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToRig" DROP CONSTRAINT "_ActivityToRig_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToRig" DROP CONSTRAINT "_ActivityToRig_B_fkey";

-- DropForeignKey
ALTER TABLE "_CouponToPlan" DROP CONSTRAINT "_CouponToPlan_A_fkey";

-- DropForeignKey
ALTER TABLE "_CouponToPlan" DROP CONSTRAINT "_CouponToPlan_B_fkey";

-- DropForeignKey
ALTER TABLE "_RigToTypeOfDevrief" DROP CONSTRAINT "_RigToTypeOfDevrief_A_fkey";

-- DropForeignKey
ALTER TABLE "_RigToTypeOfDevrief" DROP CONSTRAINT "_RigToTypeOfDevrief_B_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Alert";

-- DropTable
DROP TABLE "AppHome";

-- DropTable
DROP TABLE "Area";

-- DropTable
DROP TABLE "CardSubmission";

-- DropTable
DROP TABLE "CardType";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "DailyDebrief";

-- DropTable
DROP TABLE "DebriefQuestion";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "GameResult";

-- DropTable
DROP TABLE "Hazard";

-- DropTable
DROP TABLE "Heatmap";

-- DropTable
DROP TABLE "HeatmapArea";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Puzzle";

-- DropTable
DROP TABLE "QuestionAnwser";

-- DropTable
DROP TABLE "Rig";

-- DropTable
DROP TABLE "RigAdmin";

-- DropTable
DROP TABLE "RigType";

-- DropTable
DROP TABLE "Subscriptions";

-- DropTable
DROP TABLE "TypeOfDevrief";

-- DropTable
DROP TABLE "Videos";

-- DropTable
DROP TABLE "_ActivityToRig";

-- DropTable
DROP TABLE "_CouponToPlan";

-- DropTable
DROP TABLE "_RigToTypeOfDevrief";

-- DropEnum
DROP TYPE "DateType";

-- DropEnum
DROP TYPE "DurationType";

-- DropEnum
DROP TYPE "GameType";

-- DropEnum
DROP TYPE "HeatmapStatus";

-- DropEnum
DROP TYPE "RiskSeverity";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "UserType";
