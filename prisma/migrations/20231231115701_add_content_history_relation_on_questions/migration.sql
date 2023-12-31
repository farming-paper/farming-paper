-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "original_id" BIGINT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_original_id_fkey" FOREIGN KEY ("original_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
