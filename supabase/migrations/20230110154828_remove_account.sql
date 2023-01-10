alter table "public"."accounts" drop constraint "profiles_id_key";

alter table "public"."accounts" drop constraint "accounts_pkey";

drop index if exists "public"."accounts_pkey";

drop index if exists "public"."profiles_id_key";

drop table "public"."accounts";


