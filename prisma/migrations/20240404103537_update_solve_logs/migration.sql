-- DropIndex
DROP INDEX "solve_logs_question_id_key";

-- CreateIndex
CREATE INDEX "solve_logs_created_at_idx" ON "solve_logs"("created_at");
