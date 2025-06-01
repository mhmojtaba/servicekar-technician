import React from "react";
import Logout from "./logout";
import MenuItems from "./MenuItems";

const AdminMenuItems = ({ setIsShow }) => {
  return (
    <div className="flex flex-col h-full justify-between py-2 border-l border-neutral-200">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent ">
        <MenuItems setIsShow={setIsShow} />
      </div>
      <div className="mt-auto pt-2 border-t border-neutral-200">
        <Logout />
      </div>
    </div>
  );
};

export default AdminMenuItems;
