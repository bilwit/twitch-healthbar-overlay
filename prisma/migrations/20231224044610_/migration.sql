-- CreateTable
CREATE TABLE "relations" (
    "id" SERIAL NOT NULL,
    "ref_id" INTEGER NOT NULL,

    CONSTRAINT "relations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
