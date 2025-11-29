import { sidebarItems } from "@/utils/sidebarItems";
import React from "react";

const Sidebar = () => {
  return (
    <>
      <div>
        {sidebarItems.map((item) => (
          <div key={item.title}>
            {item.icon}
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
