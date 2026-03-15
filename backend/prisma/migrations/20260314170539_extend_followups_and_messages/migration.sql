/*
  Warnings:

  - Added the required column `title` to the `follow_ups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "follow_ups" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "subject" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
