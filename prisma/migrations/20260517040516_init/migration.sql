-- AlterTable
ALTER TABLE "CardSubmission" ADD COLUMN     "employeeCompany" TEXT,
ADD COLUMN     "employeeName" TEXT,
ADD COLUMN     "employeePosition" TEXT;

-- AlterTable
ALTER TABLE "DailyDebrief" ADD COLUMN     "employeeCompany" TEXT,
ADD COLUMN     "employeeName" TEXT,
ADD COLUMN     "employeePosition" TEXT;
