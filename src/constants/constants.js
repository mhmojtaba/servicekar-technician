import {
  FileIcon,
  HomeIcon,
  MessageCircle,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";

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
    path: "/accounting/",
    icon: <FileIcon size={16} />,
  },
  {
    id: 3,
    name: "پروفایل",
    path: "/profile/",
    icon: <UserIcon size={16} />,
  },
  // {
  //   id: 4,
  //   name: "امتیازات",
  //   path: "/scores/",
  //   icon: <TrendingUpIcon size={16} />,
  // },
  {
    id: 4,
    name: "پیام رسان",
    path: "/messages/",
    icon: <MessageCircle size={16} />,
  },
];
