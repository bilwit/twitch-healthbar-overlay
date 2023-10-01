/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `monster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "monster_name_key" ON "monster"("name");
