import { Button } from "antd";
import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className=" rounded-lg min-h-screen bg-[#FDFDFD]">
      <div className="px-[32px] py-6 text-white bg-info rounded-t-lg flex items-center gap-3">
        <FaAngleLeft onClick={() => navigate(-1)} className="text-white" size={34} />
        <h1 className="text-[30px] text-[#1E648C] font-bold">Notifications</h1>
      </div>
      <div className="p-[24px]">
        <div className="group flex items-center gap-4 px-[24px] py-4 cursor-pointer border-b border-[#32A5E8] hover:bg-[#32A5E8] transition-all hover:rounded-xl">
          <IoIosNotificationsOutline
            style={{ cursor: "pointer" }}
            className={`border border-[#32A5E8] w-[42px] h-[42px] rounded-full p-1.5 shadow-sm bg-white`}
          />
          <div className="space-y-[2px] group-hover:text-white">
            <h6 className="text-lg">You have received $500 from John Doe</h6>
            <small className="text-[12px]  hover:text-gray-200">Fri, 12:30pm</small>
          </div>
        </div>
        <div className="group flex items-center gap-4 px-[24px] py-4 cursor-pointer border-b border-[#32A5E8] hover:bg-[#32A5E8] transition-all hover:rounded-xl">
          <IoIosNotificationsOutline
            style={{ cursor: "pointer" }}
            className={`border border-[#32A5E8] w-[42px] h-[42px] rounded-full p-1.5 shadow-sm bg-white`}
          />
          <div className="space-y-[2px] group-hover:text-white">
            <h6 className="text-lg">You have received $500 from John Doe</h6>
            <small className="text-[12px]  hover:text-gray-200">Fri, 12:30pm</small>
          </div>
        </div>
        <div className="group flex items-center gap-4 px-[24px] py-4 cursor-pointer border-b border-[#32A5E8] hover:bg-[#32A5E8] transition-all hover:rounded-xl">
          <IoIosNotificationsOutline
            style={{ cursor: "pointer" }}
            className={`border border-[#174C6B] w-[42px] h-[42px] rounded-full p-1.5 shadow-sm bg-white`}
          />
          <div className="space-y-[2px] group-hover:text-white">
            <h6 className="text-lg">You have received $500 from John Doe</h6>
            <small className="text-[12px]  hover:text-gray-200">Fri, 12:30pm</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
