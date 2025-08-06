import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const detectDeviceType = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const screenWidth = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();

      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );

      const isTablet = hasTouch && screenWidth >= 768 && screenWidth <= 1024;

      const isMobileScreen = hasTouch && screenWidth < 768;

      if (isMobile || isMobileScreen) {
        setDeviceType("mobile");
      } else if (isTablet) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDeviceType();

    window.addEventListener("resize", detectDeviceType);

    return () => {
      window.removeEventListener("resize", detectDeviceType);
    };
  }, []);

  return deviceType;
};
