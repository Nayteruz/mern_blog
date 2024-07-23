import useStore from "@/app/store/store.zustand";
import { FC, ReactNode } from "react";

interface IThemeProps {
  children: ReactNode;
}

export const ThemeProvider: FC<IThemeProps> = ({ children }) => {
  const { theme } = useStore();
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
