import { Bounce, ToastContainer } from "react-toastify";

import MainWrapper from "./MainWrapper";
import Providers from "./Providers";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

import "./globals.css";

export const metadata = {
  title: "پنل تکنسین شرکت خدمات گستر جزائری",
  description: "Generated by mhmojtaba",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>
          <AuthProvider>
            <RequestsProvider>
              <MainWrapper>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick={false}
                  rtl
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  transition={Bounce}
                />
                <DashboardLayout>{children}</DashboardLayout>
              </MainWrapper>
            </RequestsProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
