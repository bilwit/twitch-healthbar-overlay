-- AlterTable
ALTER TABLE "monster" ADD COLUMN     "redeems_id" INTEGER;

-- CreateTable
CREATE TABLE "redeems" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "redeems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redeems_title_key" ON "redeems"("title");

-- AddForeignKey
ALTER TABLE "monster" ADD CONSTRAINT "monster_redeems_id_fkey" FOREIGN KEY ("redeems_id") REFERENCES "redeems"("id") ON DELETE SET NULL ON UPDATE CASCADE;
