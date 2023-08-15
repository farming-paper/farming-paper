-- CreateTable
CREATE TABLE "cached" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '{}',
    "expires_in" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cached_pkey" PRIMARY KEY ("id","code")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "desc" TEXT,
    "public_id" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id","public_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "public_id" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{"type": "init"}',
    "creator" BIGINT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id","public_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "public_id" TEXT NOT NULL,
    "creator" BIGINT NOT NULL,
    "name" TEXT,
    "desc" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id","public_id")
);

-- CreateTable
CREATE TABLE "tags_questions_relation" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "tag" BIGINT NOT NULL,
    "q" BIGINT NOT NULL,

    CONSTRAINT "tags_questions_relation_pkey" PRIMARY KEY ("tag","q")
);

-- CreateTable
CREATE TABLE "template" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "public_id" TEXT NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id","public_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cached_id_key" ON "cached"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cached_code_key" ON "cached"("code");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_id_key1" ON "profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_id_key" ON "questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_public_id_key" ON "questions"("public_id");

-- CreateIndex
CREATE INDEX "question_creation_time_date_idx" ON "questions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tags_id_key" ON "tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_public_id_key" ON "tags"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_questions_relation_id_key" ON "tags_questions_relation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "template_id_key" ON "template"("id");

-- CreateIndex
CREATE UNIQUE INDEX "template_public_id_key" ON "template"("public_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_creator_fkey" FOREIGN KEY ("creator") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_creator_fkey" FOREIGN KEY ("creator") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tags_questions_relation" ADD CONSTRAINT "tags_questions_relation_q_fkey" FOREIGN KEY ("q") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tags_questions_relation" ADD CONSTRAINT "tags_questions_relation_tag_fkey" FOREIGN KEY ("tag") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

