"use client";

import { useEffect, useState } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// import Loading from "./loading";
import { toast } from "react-toastify";

const MainWrapper = ({ children }) => {
  const { setUser, setToken, isSecretary } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("tech-token");
    const storedUser = localStorage.getItem("user");

    if (pathname === "/login" && token) {
      router.push("/");
      setIsLoading(false);
      return true;
    }

    if (isSecretary) {
      if (pathname.startsWith("/secretaries")) {
        toast.error("شما دسترسی ورود به این بخش را ندارید");
        router.push("/");
        setIsLoading(false);
        return false;
      }
    }

    // if (pathname !== "/login" && !token) {
    //   router.push("/login");
    //   setIsLoading(false);
    //   return false;
    // }

    if (storedUser) {
      const userObject = JSON.parse(storedUser);

      setUser(userObject);
      setToken(token);
    }

    setIsLoading(false);
    return true;
  };

  useEffect(() => {
    checkAuth();
  }, [pathname, isSecretary]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  return <>{children}</>;
};

export default MainWrapper;
