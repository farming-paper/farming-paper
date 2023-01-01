CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";


