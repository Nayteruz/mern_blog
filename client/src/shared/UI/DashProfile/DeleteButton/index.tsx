import { useAppDispatch } from "@/app/store/hooks";
import {
  ICurrentUser,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "@/app/store/slice/user/userSlice";
import { IFetchError } from "@/shared/types";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface IDeleteButtonProps {
  user: ICurrentUser | null;
}

export const DeleteButton = ({ user }: IDeleteButtonProps) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const onDelete = async () => {
    setShowModal(false);

    if (!user) {
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        dispatch(deleteUserSuccess());
      } else {
        dispatch(deleteUserFailure("Произошла ошибка при удалении аккаунта"));
      }
    } catch (error) {
      const err = error as IFetchError;
      dispatch(deleteUserFailure(err.message));
    }
  };

  return (
    <>
      <span className="cursor-pointer" onClick={() => setShowModal(true)}>
        Удалить аккаунт
      </span>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Вы действительно хотите удалить аккаунт?
            </h3>
            <div className="flex md:flex-row flex-col justify-center gap-4 ">
              <Button color="failure" onClick={onDelete}>
                Да, я уверен
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Нет, передумал
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
