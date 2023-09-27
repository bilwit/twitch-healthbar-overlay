/*
  Warnings:

  - Added the required column `trigger_words` to the `monster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monster" ADD COLUMN     "trigger_words" VARCHAR(255) NOT NULL;
