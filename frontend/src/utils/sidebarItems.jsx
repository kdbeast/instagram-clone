import {
    Home,
    Search,
    Heart,
    MessageCircle,
    Bell,
    Settings,
    TrendingUp,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const sidebarItems = [
  {
    icon: <Home />,
    title: "Home",
  },
  {
    icon: <Search />,
    title: "Search",
  },
  {
    icon: <TrendingUp />,
    title: "Explore",
  },
  {
    icon: <MessageCircle />,
    title: "Messages",
  },
  {
    icon: <Heart />,
    title: "Likes",
  },
  {
    icon: <Bell />,
    title: "Notifications",
  },
  {
    icon: <Settings />,
    title: "Settings",
  },
  {
    icon: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    title: "Profile",
  },
  {
    icon: <LogOut />,
    title: "Logout",
  },
];
