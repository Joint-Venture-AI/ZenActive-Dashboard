import React from "react";
import { Outlet } from "react-router-dom";
import PublicRoute from "../../routes/PublicRoute";

const Auth = () => {
  return (
    <div className="bg-[#F4F9FB]">
      <div className="max-w-[1620px] flex justify-center items-center mx-auto">
        <PublicRoute>
          <Outlet />
        </PublicRoute>
      </div>
    </div>
  );
};

export default Auth;
