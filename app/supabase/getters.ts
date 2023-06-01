import { LRUCache } from "lru-cache";
import type { FilterTag } from "~/types";
import { getServerSideSupabaseClient } from "./client";

// @see https://stackoverflow.com/questions/72661999/how-do-i-use-in-memory-cache-in-remix-run-dev-mode
declare global {
  // eslint-disable-next-line no-var
  var __filterTagsCache: LRUCache<number, FilterTag[]>;
}

let filterTagsCache: LRUCache<number, FilterTag[]>;

const cacheOptions = {
  max: 500,
};

if (process.env.NODE_ENV === "production") {
  filterTagsCache = new LRUCache<number, FilterTag[]>(cacheOptions);
} else {
  if (!global.__filterTagsCache) {
    global.__filterTagsCache = new LRUCache<number, FilterTag[]>(cacheOptions);
  }
  filterTagsCache = global.__filterTagsCache;
}

export async function getFilterTagsByCreatorId(
  creatorId: number
): Promise<FilterTag[]> {
  const filterTagsFromCache = filterTagsCache.get(creatorId);

  if (filterTagsFromCache) {
    return filterTagsFromCache;
  }

  const db = getServerSideSupabaseClient();

  const filterTagsRes = await db
    .from("tags")
    .select("name, public_id")
    .eq("creator", creatorId)
    .is("deleted_at", null);

  if (filterTagsRes.data) {
    const filterTags = filterTagsRes.data.map((tag) => {
      return {
        name: tag.name || "",
        publicId: tag.public_id,
      };
    });
    filterTagsCache.set(creatorId, filterTags);
    return filterTags;
  }

  throw new Response("No Filter Tags", {
    status: 401,
  });
}
