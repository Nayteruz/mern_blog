import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { ROUTES } from "@/shared/const/routes";
import { IFetchError } from "@/shared/types";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import useStore from "@/app/store/store.zustand";

export const DashSidebar = () => {
  const { currentUser, fetchSignOutSuccess } = useStore();
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={`${ROUTES.DASHBOARD}?tab=profile`}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Профиль
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <>
              <Link to={`${ROUTES.DASHBOARD}?tab=posts`}>
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Посты
                </Sidebar.Item>
              </Link>
              <Link to={`${ROUTES.DASHBOARD}?tab=users`}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Пользователи
                </Sidebar.Item>
              </Link>
              <Link to={`${ROUTES.DASHBOARD}?tab=comments`}>
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Комментарии
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Link to="#">
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              as="div"
              onClick={signout}
            >
              Выйти
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
