import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { signoutUser } from "@/app/store/slice/user/userSlice";
import { ROUTES } from "@/shared/const/routes";
import { IFetchError } from "@/shared/types";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

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
            <Link to={`${ROUTES.DASHBOARD}?tab=posts`}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Посты
              </Sidebar.Item>
            </Link>
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
