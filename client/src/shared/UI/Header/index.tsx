import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Logo } from "../Logo";
import { ROUTES } from "@/shared/const/routes";
import { IFetchError } from "@/shared/types";
import useStore from "@/app/store/store.zustand";

export const Header = () => {
  const { theme, toggleTheme, currentUser, fetchSignOutSuccess } = useStore();
  const { pathname } = useLocation();
  const links: { label: string; path: string }[] = [
    { label: "Главная", path: ROUTES.HOME },
    { label: "О нас", path: ROUTES.ABOUT },
    { label: "Проекты", path: ROUTES.PROJECTS },
  ];

  const signout = async () => {
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
    <Navbar className="border-b-2">
      <Logo />
      <form>
        <TextInput
          type="text"
          placeholder="Поиск..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline focus-visible:outline-none"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={toggleTheme}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={`${ROUTES.DASHBOARD}?tab=profile`}>
              <Dropdown.Item>Профиль</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={signout}>Выйти</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={ROUTES.SIGN_IN}>
            <Button gradientDuoTone="purpleToBlue" outline>
              Войти
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {links.map((link) => (
          <Navbar.Link key={link.path} active={pathname === link.path} as="div">
            <Link to={link.path}>{link.label}</Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};
