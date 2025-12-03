import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "../components/CreatePost";
import { setSelectedPost } from "@/redux/postSlice";
import { sidebarItems } from "@/utils/sidebarItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector(
    (state) => state.realTimeNotification
  );
  console.log(likeNotification);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (title) => {
    if (title === "Logout") logoutHandler();
    else if (title === "Create") setOpen(true);
    else if (title === "Profile") navigate(`/profile/${user?._id}`);
    else if (title === "Home") navigate(`/`);
    else if (title === "Messages") navigate(`/chat`);
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
              {item.title === "Notifications" &&
                likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                      >
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {likeNotification.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          likeNotification.map((notification) => {
                            return (
                              <div
                                key={notification.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      notification.userDetails?.profilePicture
                                    }
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.username}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;
