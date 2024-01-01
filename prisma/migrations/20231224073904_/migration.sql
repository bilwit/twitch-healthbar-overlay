/*
  Warnings:

  - You are about to drop the column `ref_id` on the `relations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "relations" DROP CONSTRAINT "relations_ref_id_fkey";

-- AlterTable
ALTER TABLE "monster" ADD COLUMN     "relations_id" INTEGER;

-- AlterTable
ALTER TABLE "relations" DROP COLUMN "ref_id";

-- AddForeignKey
ALTER TABLE "monster" ADD CONSTRAINT "monster_relations_id_fkey" FOREIGN KEY ("relations_id") REFERENCES "relations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
