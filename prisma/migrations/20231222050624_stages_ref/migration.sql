-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "ref_id" INTEGER NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
