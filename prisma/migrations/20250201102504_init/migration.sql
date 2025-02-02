/*
  Warnings:

  - You are about to drop the column `skill` on the `JobRequirement` table. All the data in the column will be lost.
  - You are about to drop the `Metadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "JobRequirement" DROP COLUMN "skill",
ADD COLUMN     "skills" TEXT[];

-- DropTable
DROP TABLE "Metadata";
