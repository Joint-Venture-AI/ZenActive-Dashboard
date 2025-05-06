import React from "react";
import { FaArrowLeftLong, FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const PageHeading = ({ title, backPath, disabledBackBtn, className }) => {
  const navigate = useNavigate();
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!disabledBackBtn && (
        <button
          className="outline-none px-2"
          onClick={() => navigate(backPath || "/settings")}
        >
          <FaArrowLeftLong size={22} />
        </button>
      )}
      {!!title && <h1 className="text-[25px] text-[#3A3A3A]">{title}</h1>}
    </div>
  );
};

export default PageHeading;
