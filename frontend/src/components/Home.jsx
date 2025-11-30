import Feed from "./Feed";
import { Outlet } from "react-router";
import RightSidebar from "./RightSidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
