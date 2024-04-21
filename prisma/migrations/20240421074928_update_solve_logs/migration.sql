-- AlterTable
ALTER TABLE "solve_logs" ADD COLUMN     "ignored_since" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "solve_logs_question_id_idx" ON "solve_logs"("question_id");

-- CreateIndex
CREATE INDEX "solve_logs_profile_id_idx" ON "solve_logs"("profile_id");

-- CreateIndex
CREATE INDEX "solve_logs_ignored_since_idx" ON "solve_logs"("ignored_since");
