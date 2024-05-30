import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";

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
  supabase: SupabaseClient;
}

export interface ITag {
  desc?: string;
  name: string;
  publicId: string;
}

export interface ITagWithCount extends ITag {
  count: number;
}
