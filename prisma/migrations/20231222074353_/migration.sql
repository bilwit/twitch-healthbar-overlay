-- DropForeignKey
ALTER TABLE "stages" DROP CONSTRAINT "stages_ref_id_fkey";

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
