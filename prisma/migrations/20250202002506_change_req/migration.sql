/*
  Warnings:

  - You are about to drop the column `jobId` on the `JobRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `JobRequirement` table. All the data in the column will be lost.
  - Added the required column `skill` to the `JobRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobRequirement" DROP CONSTRAINT "JobRequirement_jobId_fkey";

-- DropIndex
DROP INDEX "JobRequirement_jobId_key";

-- AlterTable
ALTER TABLE "JobRequirement" DROP COLUMN "jobId",
DROP COLUMN "skills",
ADD COLUMN     "skill" TEXT NOT NULL;
