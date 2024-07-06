import { FC } from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link
      to="/"
      className={`${className ? className : "self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"}`}
    >
      <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
        Alex's
      </span>{" "}
      Blog
    </Link>
  );
};
