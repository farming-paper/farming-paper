alter table "public"."tags_questions_relation" drop constraint "tags_questions_relation_pkey";

drop index if exists "public"."tags_questions_relation_pkey";

CREATE UNIQUE INDEX tags_questions_relation_pkey ON public.tags_questions_relation USING btree (tag, q);

alter table "public"."tags_questions_relation" add constraint "tags_questions_relation_pkey" PRIMARY KEY using index "tags_questions_relation_pkey";


