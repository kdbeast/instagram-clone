import axios from "axios";
import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { sidebarItems } from "@/utils/sidebarItems";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/logout",
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success === true) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (title) => {
    if (title === "Logout") logoutHandler();
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>
          {sidebarItems.map((item) => (
            <div
              key={item.title}
              onClick={() => sidebarHandler(item.title)}
              className="flex items-center gap-4 relative hover:bg-gray-100 rounded-lg p-3 cursor-pointer my-3"
            >
              {item.icon}
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
