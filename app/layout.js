"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  const shouldHideNavbar =
    pathname === "/login" || pathname === "/register";

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "text-black"
      }`}
    >
      {!shouldHideNavbar && (
        <div className={`p-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <Navbar />
        </div>
      )}
      <main className="mt-4">{children}</main>
      <ToastContainer />
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LayoutWrapper>
              <div className="pb-2 pt-3">{children}</div>
            </LayoutWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
