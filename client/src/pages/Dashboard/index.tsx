import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashPosts } from "./DashPosts";
import { DashSidebar } from "./DashSidebar";
import { DashProfile } from "./DashProfile";
import { DashUsers } from "./DashUsers";
import { DashComments } from "./DashComments";

export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
    </div>
  );
};
