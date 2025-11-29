import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default MainLayout;
