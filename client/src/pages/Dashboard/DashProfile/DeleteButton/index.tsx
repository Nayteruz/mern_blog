import { useAppDispatch } from "@/app/store/hooks";
import {
  ICurrentUser,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "@/app/store/slice/user/userSlice";
import { IFetchError } from "@/shared/types";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";
import { useState } from "react";

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
      <PopupConfirm
        isOpen={showModal}
        setIsOpen={setShowModal}
        message="Вы действительно хотите удалить аккаунт?"
        onConfirm={onDelete}
      />
    </>
  );
};
