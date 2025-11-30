import { Outlet } from "react-router";
import Sidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default MainLayout;
