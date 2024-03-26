import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

export default function useAddTagFilter() {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    (tagPublicId: string) => {
      setSearchParams((params) => {
        const tags = params.get("tags")?.split(",") ?? [];
        if (tags.includes(tagPublicId)) {
          return params;
        }

        return new URLSearchParams({
          ...params,
          tags: [...tags, tagPublicId].join(","),
        });
      });
    },
    [setSearchParams]
  );
}
