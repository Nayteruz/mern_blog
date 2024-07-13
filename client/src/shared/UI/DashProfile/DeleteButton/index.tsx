import { useAppDispatch } from "@/app/store/hooks";
import {
  ICurrentUser,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} from "@/app/store/slice/user/userSlice";
import { IFetchError } from "@/shared/types";

interface IDeleteButtonProps {
  user: ICurrentUser | null;
}

export const DeleteButton = ({ user }: IDeleteButtonProps) => {
  const dispatch = useAppDispatch();

  const onDelete = async () => {
    console.log("delete");

    if (!user) {
      return;
    }

    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        dispatch(deleteSuccess());
      } else {
        dispatch(deleteFailure("Произошла ошибка при удалении аккаунта"));
      }
    } catch (error) {
      const err = error as IFetchError;
      dispatch(deleteFailure(err.message));
    }
  };

  return (
    <span className="cursor-pointer" onClick={onDelete}>
      Удалить аккаунт
    </span>
  );
};
