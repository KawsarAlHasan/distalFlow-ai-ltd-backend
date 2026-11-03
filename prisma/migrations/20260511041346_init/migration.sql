-- AlterTable
ALTER TABLE "Puzzle" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "isAllRigs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rigIds" INTEGER[];

-- AlterTable
ALTER TABLE "QuestionAnwser" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "isAllRigs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rigIds" INTEGER[];

-- AddForeignKey
ALTER TABLE "QuestionAnwser" ADD CONSTRAINT "QuestionAnwser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puzzle" ADD CONSTRAINT "Puzzle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
