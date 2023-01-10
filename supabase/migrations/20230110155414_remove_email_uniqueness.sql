alter table "public"."profiles" drop constraint "profiles_email_key";

drop index if exists "public"."profiles_email_key";


