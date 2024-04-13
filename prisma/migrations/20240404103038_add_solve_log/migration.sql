-- CreateTable
CREATE TABLE "solve_logs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "question_id" BIGINT NOT NULL,
    "profile_id" BIGINT NOT NULL,

    CONSTRAINT "solve_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "solve_logs_id_key" ON "solve_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "solve_logs_question_id_key" ON "solve_logs"("question_id");

-- CreateIndex
CREATE INDEX "tags_created_at_idx" ON "tags"("created_at");

-- AddForeignKey
ALTER TABLE "solve_logs" ADD CONSTRAINT "solve_logs_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solve_logs" ADD CONSTRAINT "solve_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
