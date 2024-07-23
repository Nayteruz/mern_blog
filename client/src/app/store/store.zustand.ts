import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser } from "@/shared/types";

type TTheme = "light" | "dark";

type Store = {
  theme: TTheme;
  toggleTheme: () => void;
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
  setStartLoading: () => void;
  setErrorLoading: (err: string) => void;
  fetchSignInSuccess: (user: IUser) => void;
  fetchUpdateUserSuccess: (user: IUser) => void;
  fetchDeleteUserSuccess: () => void;
  fetchSignOutSuccess: () => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      currentUser: null,
      loading: false,
      error: null,
      setStartLoading: () => set(() => ({ loading: true, error: null })),
      setErrorLoading: (err: string) =>
        set(() => ({ loading: false, error: err })),
      fetchSignInSuccess: (user: IUser) =>
        set(() => ({ currentUser: user, loading: false })),
      fetchUpdateUserSuccess: (user: IUser) =>
        set(() => ({ currentUser: user, loading: false, error: null })),
      fetchDeleteUserSuccess: () =>
        set(() => ({ currentUser: null, loading: false, error: null })),
      fetchSignOutSuccess: () =>
        set(() => ({ currentUser: null, loading: false, error: null })),
    }),
    {
      name: "mern_state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
