import Feed from "./Feed";
import { Outlet } from "react-router";
import RightSidebar from "./RightSidebar";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetAllPost from "@/hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
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
