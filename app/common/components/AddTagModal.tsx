import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { Check, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuestion } from "~/question/context";
import type { ITagWithCount } from "~/types";
import { filterByContainsHangul } from "~/util";

export function SetTagModal({
  TriggerButton,
  tags,
}: {
  TriggerButton(props: { onPress: () => void }): React.ReactNode;
  tags: ITagWithCount[];
}) {
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const question = useQuestion();
  const checked = useMemo(() => {
    const checked = new Set<string>();
    for (const tag of question.tags) {
      checked.add(tag.publicId);
    }
    return checked;
  }, [question.tags]);

  const filteredTags = filterByContainsHangul(tags, search);

  return (
    <>
      <TriggerButton onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(_onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                태그 추가
              </ModalHeader>
              <ModalBody className="flex flex-col items-stretch w-full gap-2">
                <Input
                  isClearable
                  labelPlacement="outside"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                  placeholder="태그 이름을 입력하세요..."
                  startContent={
                    <Search className="text-black/50 mb-0.5 dark:text-white/90 text-gray-400 pointer-events-none flex-shrink-0 w-4 h-4" />
                  }
                />
                <div className="h-48 flex flex-col items-stretch w-full gap-0.5">
                  {filteredTags.map((tag) => (
                    <Form method="post" key={tag.publicId} className="w-full">
                      {checked.has(tag.publicId) ? (
                        <input type="hidden" name="intent" value="unset_tag" />
                      ) : (
                        <input type="hidden" name="intent" value="set_tag" />
                      )}
                      <input
                        type="hidden"
                        name="tag_public_id"
                        value={tag.publicId}
                      />
                      <input
                        type="hidden"
                        name="question_public_id"
                        value={question.publicId}
                      />
                      <Button
                        endContent={
                          <span className="text-gray-400">{tag.count}</span>
                        }
                        variant="light"
                        className="justify-between w-full"
                        type="submit"
                      >
                        <span className="inline-flex items-center gap-3">
                          {checked.has(tag.publicId) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="w-4 h-4" />
                          )}
                          <span>{tag.name}</span>
                        </span>
                      </Button>
                    </Form>
                  ))}
                  {!filteredTags.find((tag) => tag.name === search) &&
                    search && (
                      <Form method="post" key="create_tag" className="w-full">
                        <input type="hidden" name="intent" value="create_tag" />
                        <input type="hidden" name="name" value={search} />
                        <Button
                          startContent={<Plus className="w-4 h-4" />}
                          variant="light"
                          className="justify-start"
                          type="submit"
                        >
                          "{search}" 태그 추가
                        </Button>
                      </Form>
                    )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
