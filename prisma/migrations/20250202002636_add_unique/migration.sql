/*
  Warnings:

  - A unique constraint covering the columns `[skill]` on the table `JobRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobRequirement_skill_key" ON "JobRequirement"("skill");
