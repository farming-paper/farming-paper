import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useQuestion } from "~/question/context";

export const DeleteQuestionModalWithButton = ({
  TriggerButton: OpenModalButton,
}: {
  TriggerButton: (props: { onPress: () => void }) => React.ReactNode;
}) => {
  const { publicId } = useQuestion();
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <OpenModalButton onPress={onOpen} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                문제 삭제
              </ModalHeader>
              <ModalBody>
                <p>정말로 문제를 삭제하시겠습니까?</p>
              </ModalBody>

              <ModalFooter>
                <Form method="post" className="flex flex-row justify-end gap-2">
                  <input type="hidden" name="intent" value="remove_question" />
                  <input type="hidden" name="public_id" value={publicId} />
                  <Button onPress={onClose} variant="light">
                    취소
                  </Button>
                  <Button color="danger" onPress={onClose} type="submit">
                    삭제
                  </Button>
                </Form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
