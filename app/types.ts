import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";
import type { PartialDeep as PartialDeepTypeFest } from "type-fest";
import type { Database } from "./supabase/generated/supabase-types";

export interface IProfile {
  id: number;
  public_id: string;
  email: string;
  photo?: string;
  name?: string;
  desc?: string;
}

export interface IOutletProps {
  session: Session | null;
  supabase: SupabaseClient<Database>;
}

export type PartialDeep<T> = PartialDeepTypeFest<
  T,
  { recurseIntoArrays: true }
>;

export interface ITag {
  desc?: string;
  name: string;
  publicId: string;
}

export interface ITagWithCount extends ITag {
  count: number;
}

export type DatabaseTag = Database["public"]["Tables"]["tags"]["Row"];

export type FilterTag = {
  name: string;
  publicId: string;
};
