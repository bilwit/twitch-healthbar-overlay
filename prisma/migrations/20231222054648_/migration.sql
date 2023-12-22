-- AlterTable
ALTER TABLE "stages" ADD COLUMN     "avatar_url" VARCHAR(255),
ADD COLUMN     "hp_value" INTEGER NOT NULL DEFAULT 25;
