import { IFetchError } from "@/shared/types";
import useStore from "@/app/store/store.zustand";

export const SignOut = () => {
  const { fetchSignOutSuccess } = useStore();

  const onCLick = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        fetchSignOutSuccess();
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
