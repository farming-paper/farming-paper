import { Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Check, Loader2 } from "lucide-react";
import type { ITagWithCount } from "~/types";

export default function TagToggleButton({
  tag,
  checked,
  questionPublicId,
}: {
  tag: ITagWithCount;
  checked: Set<string>;
  questionPublicId: string;
}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" key={tag.publicId} className="w-full">
      {checked.has(tag.publicId) ? (
        <input type="hidden" name="intent" value="unset_tag" />
      ) : (
        <input type="hidden" name="intent" value="set_tag" />
      )}
      <input type="hidden" name="tag_public_id" value={tag.publicId} />
      <input type="hidden" name="question_public_id" value={questionPublicId} />
      <Button
        endContent={<span className="text-gray-400">{tag.count}</span>}
        variant="light"
        className="justify-between w-full"
        type="submit"
        isDisabled={fetcher.state !== "idle"}
      >
        <span className="inline-flex items-center gap-3">
          {fetcher.state !== "idle" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : checked.has(tag.publicId) ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="w-4 h-4" />
          )}
          <span>{tag.name}</span>
        </span>
      </Button>
    </fetcher.Form>
  );
}
