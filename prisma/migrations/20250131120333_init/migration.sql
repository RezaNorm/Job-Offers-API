/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `JobRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobRequirement_jobId_key" ON "JobRequirement"("jobId");
