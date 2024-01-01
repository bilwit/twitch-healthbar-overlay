/*
  Warnings:

  - You are about to drop the column `name` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `value` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "name",
ADD COLUMN     "value" VARCHAR(255) NOT NULL;
