import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PrivateProtectedRoute from "../../routes/PrivateProtectedRoute";

const Main = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="lg:flex text-start bg-white min-h-screen w-full">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <div className="flex-1 lg:pl-[290px] bg-[#F2F5F7]">
        <div
          className={`w-full z-10 transition-all sticky top-0 ${
            isScrolled
              ? "bg-white shadow-md"
              : "bg-transparent"
          }`}
        >
          <div className="p-[24px] lg:pl-0">
            <Header />
          </div>
        </div>
        <div className="p-[24px] pt-0.5">
          <PrivateProtectedRoute>
            <Outlet />
          </PrivateProtectedRoute>
        </div>
      </div>
    </div>
  );
};

export default Main;
