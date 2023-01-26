alter table "public"."cached" alter column "expires_in" set data type timestamp with time zone using "expires_in"::timestamp with time zone;


