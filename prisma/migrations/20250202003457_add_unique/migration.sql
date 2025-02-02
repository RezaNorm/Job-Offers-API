-- CreateTable
CREATE TABLE "JobRequirementOnJob" (
    "jobId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,

    CONSTRAINT "JobRequirementOnJob_pkey" PRIMARY KEY ("jobId","requirementId")
);

-- AddForeignKey
ALTER TABLE "JobRequirementOnJob" ADD CONSTRAINT "JobRequirementOnJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequirementOnJob" ADD CONSTRAINT "JobRequirementOnJob_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "JobRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
