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
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuestion } from "~/question/context";
import type { ITagWithCount } from "~/types";
import { filterByContainsHangul } from "~/util";
import TagToggleButton from "./TagToggleButton";

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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
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
                <div className="flex flex-col items-stretch w-full gap-0.5">
                  {filteredTags.map((tag) => (
                    <TagToggleButton
                      key={tag.publicId}
                      checked={checked}
                      questionPublicId={question.publicId}
                      tag={tag}
                    />
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
