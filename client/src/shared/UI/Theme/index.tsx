import { useAppSelector } from "@/app/store/hooks";
import { FC, ReactNode } from "react";

interface IThemeProps {
  children: ReactNode;
}

export const ThemeProvider: FC<IThemeProps> = ({ children }) => {
  const { theme } = useAppSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42]">
        {children}
      </div>
    </div>
  );
};
