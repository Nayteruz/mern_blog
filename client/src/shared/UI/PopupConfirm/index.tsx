import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IPopupConfirmProps } from "./types";

export const PopupConfirm = ({
  isOpen,
  setIsOpen,
  message,
  ok = "Да, я уверен",
  cancel = "Нет, передумал",
  onConfirm,
}: IPopupConfirmProps) => {
  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)} popup size="md">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="w-14 h-14 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
          {message && (
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {message}
            </h3>
          )}
          <div className="flex md:flex-row flex-col justify-center gap-4 ">
            <Button color="failure" onClick={onConfirm}>
              {ok}
            </Button>
            <Button color="gray" onClick={() => setIsOpen(false)}>
              {cancel}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
