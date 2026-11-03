-- CreateTable
CREATE TABLE "DebriefQuestion" (
    "id" SERIAL NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER,
    "rigId" INTEGER,
    "question" TEXT,
    "placeholder" TEXT,
    "status" "AllStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebriefQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DebriefQuestion" ADD CONSTRAINT "DebriefQuestion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebriefQuestion" ADD CONSTRAINT "DebriefQuestion_rigId_fkey" FOREIGN KEY ("rigId") REFERENCES "Rig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
