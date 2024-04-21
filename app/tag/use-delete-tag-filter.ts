import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

export default function useDeleteTagFilter() {
  const [, setSearchParams] = useSearchParams();

  return useCallback(
    (tagPublicId: string) => {
      setSearchParams((params) => {
        const tags = params.get("tags")?.split(",") ?? [];
        if (!tags.includes(tagPublicId)) {
          return params;
        }

        const deleted = tags.filter((tag) => tag !== tagPublicId);

        if (deleted.length === 0) {
          const result = new URLSearchParams(params);
          result.delete("tags");
          return result;
        }

        return new URLSearchParams({
          ...params,
          tags: deleted.join(","),
        });
      });
    },
    [setSearchParams]
  );
}
