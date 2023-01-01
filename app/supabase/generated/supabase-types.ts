/* eslint-disable @typescript-eslint/naming-convention */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName: string;
          query: string;
          variables: Json;
          extensions: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string;
          created_at: string;
          deleted_at: string | null;
          email: string;
          id: number;
          photo: string | null;
          provider: string;
          provider_id: string;
          refresh_token: string;
          updated_at: string;
        };
        Insert: {
          access_token: string;
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          id?: number;
          photo?: string | null;
          provider: string;
          provider_id: string;
          refresh_token: string;
          updated_at?: string;
        };
        Update: {
          access_token?: string;
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          id?: number;
          photo?: string | null;
          provider?: string;
          provider_id?: string;
          refresh_token?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          desc: string | null;
          email: string;
          id: number;
          name: string | null;
          photo: string | null;
          public_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          desc?: string | null;
          email: string;
          id?: number;
          name?: string | null;
          photo?: string | null;
          public_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          desc?: string | null;
          email?: string;
          id?: number;
          name?: string | null;
          photo?: string | null;
          public_id?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          content: Json;
          created_at: string;
          creator: number;
          deleted_at: string | null;
          id: number;
          public_id: string;
          updated_at: string;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          creator: number;
          deleted_at?: string | null;
          id?: number;
          public_id: string;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          creator?: number;
          deleted_at?: string | null;
          id?: number;
          public_id?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          created_at: string;
          creator: number;
          deleted_at: string | null;
          desc: string | null;
          id: number;
          name: string | null;
          public_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          creator: number;
          deleted_at?: string | null;
          desc?: string | null;
          id?: number;
          name?: string | null;
          public_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          creator?: number;
          deleted_at?: string | null;
          desc?: string | null;
          id?: number;
          name?: string | null;
          public_id?: string;
          updated_at?: string;
        };
      };
      tags_questions_relation: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          id: number;
          q: number;
          tag: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          q: number;
          tag: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          q?: number;
          tag?: number;
          updated_at?: string;
        };
      };
      template: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          id: number;
          public_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          public_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          public_id?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: { size: number; bucket_id: string }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits: number;
          levels: number;
          offsets: number;
          search: string;
          sortcolumn: string;
          sortorder: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
