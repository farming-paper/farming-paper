import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import type { ITagWithCount } from "~/types";
import { filterByContainsHangul } from "~/util";

export function AddTagModal({
  TriggerButton,
  addableTags,
  onSelect,
}: {
  TriggerButton(props: { onPress: () => void }): React.ReactNode;
  addableTags: ITagWithCount[];
  onSelect(item: ITagWithCount): void;
}) {
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filteredTags = filterByContainsHangul(addableTags, search);

  return (
    <>
      <TriggerButton onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
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
                    <Button
                      key={tag.publicId}
                      endContent={tag.count}
                      variant="light"
                      className="justify-start"
                      onPress={() => {
                        onClose();
                        onSelect(tag);
                      }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                  {!filteredTags.find((tag) => tag.name === search) &&
                    search && (
                      <Button
                        startContent={<Plus className="w-4 h-4" />}
                        variant="light"
                        className="justify-start"
                        onPress={() => {
                          onClose();
                          onSelect({
                            name: search,
                            publicId: search,
                            count: 0,
                          });
                        }}
                      >
                        "{search}" 태그 추가
                      </Button>
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
