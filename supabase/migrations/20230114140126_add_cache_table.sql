create table "public"."cached" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "deleted_at" timestamp with time zone,
    "code" text not null default ''::text,
    "content" jsonb not null default '{}'::jsonb,
    "expires_in" date not null
);


alter table "public"."cached" enable row level security;

CREATE UNIQUE INDEX cached_code_key ON public.cached USING btree (code);

CREATE UNIQUE INDEX cached_id_key ON public.cached USING btree (id);

CREATE UNIQUE INDEX cached_pkey ON public.cached USING btree (id, code);

alter table "public"."cached" add constraint "cached_pkey" PRIMARY KEY using index "cached_pkey";

alter table "public"."cached" add constraint "cached_code_key" UNIQUE using index "cached_code_key";

alter table "public"."cached" add constraint "cached_id_key" UNIQUE using index "cached_id_key";

