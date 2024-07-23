import useStore from "@/app/store/store.zustand";
import { IFetchError, IUser } from "@/shared/types";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";
import { useState } from "react";

interface IDeleteButtonProps {
  user: IUser | null;
}

export const DeleteButton = ({ user }: IDeleteButtonProps) => {
  const { setErrorLoading, setStartLoading, fetchDeleteUserSuccess } =
    useStore();
  const [showModal, setShowModal] = useState(false);

  const onDelete = async () => {
    setShowModal(false);

    if (!user) {
      return;
    }

    try {
      setStartLoading();
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchDeleteUserSuccess();
      } else {
        setErrorLoading("Произошла ошибка при удалении аккаунта");
      }
    } catch (error) {
      const err = error as IFetchError;
      setErrorLoading(err.message);
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
