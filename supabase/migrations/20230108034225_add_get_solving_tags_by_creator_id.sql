set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_solving_tags_by_creator_id(p_creator bigint)
 RETURNS TABLE(id bigint, name text, "desc" text, public_id text, count bigint)
 LANGUAGE plpgsql
AS $function$
begin
	return query 
		select
      tag.id,
      (array_agg(tag.name)) [1] as name,
      (array_agg(tag.desc)) [1] as desc,
      (array_agg(tag.public_id)) [1] as public_id,
      count(relation)
    from
      tags tag
      inner join tags_questions_relation relation on tag.id = relation.tag
    where tag.creator = p_creator
    group by tag.id;
end;$function$
;

CREATE OR REPLACE FUNCTION public.hello_world()
 RETURNS text
 LANGUAGE sql
AS $function$
  select 'Hello world';
$function$
;


