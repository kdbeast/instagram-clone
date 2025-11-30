import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "../components/CreatePost";
import { sidebarItems } from "@/utils/sidebarItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (title) => {
    if (title === "Logout") logoutHandler();
    else if (title === "Create") setOpen(true);
    else navigate(`/${title.toLowerCase()}`);
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzTq4--BFoPL-kbqI4Vj3mnt1YQ8rPpvtGiQ&s"
          alt="instagram-logo"
        />
        <div>
          {sidebarItems.map((item) => (
            <div
              key={item.title}
              onClick={() => sidebarHandler(item.title)}
              className="flex items-center gap-4 relative hover:bg-gray-100 rounded-lg p-3 cursor-pointer my-3"
            >
              {item.icon}
              {item.title === "Profile" && (
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;
