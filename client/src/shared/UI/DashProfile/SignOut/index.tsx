import { IFetchError } from "@/shared/types";
import { signoutUser } from "@/app/store/slice/user/userSlice";
import { useAppDispatch } from "@/app/store/hooks";

export const SignOut = () => {
  const dispatch = useAppDispatch();

  const onCLick = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signoutUser());
      } else {
        console.error(data.message);
      }
    } catch (error) {
      const err = error as IFetchError;
      console.error(err.message);
    }
  };

  return (
    <span onClick={onCLick} className="cursor-pointer">
      Выйти
    </span>
  );
};
