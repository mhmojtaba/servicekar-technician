import { FileIcon, HomeIcon, UserIcon } from "lucide-react";

export const mainMeniRoutes = [
  {
    id: 1,
    name: "داشبورد",
    path: "/",
    icon: <HomeIcon size={16} />,
  },
  {
    id: 2,
    name: "حسابداری",
    path: "/accounting",
    icon: <FileIcon size={16} />,
  },
  {
    id: 3,
    name: "پروفایل",
    path: "/profile",
    icon: <UserIcon size={16} />,
  },
];
