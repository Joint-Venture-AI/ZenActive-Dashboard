import { FaArrowLeft, FaRegEyeSlash } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { LuMailOpen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { TbMailOpened } from "react-icons/tb";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Swal from "sweetalert2";
import { useForgotPasswordMutation } from "../../../../redux/features/auth/authApi";
import { useState } from "react";
import { message } from "antd";
import LoadingSpinner from "../../../../Components/LoadingSpinner";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/features/auth/authSlice";

const ForgotPassword = () => {
  const user = useSelector(useCurrentUser);
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email: user?.email });
      if (response?.data?.status == 200) {
        message.success(response?.data?.message || "Check your email for OTP");
        navigate(`verify-email`, {
          state: { email: user?.email },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!!",
          text:
            response?.data?.message ||
            response?.error?.data?.message ||
            "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#F4F9FB] rounded-lg shadow-lg mt-8 w-[610px] h-[468px] mx-auto py-10 px-8">
        <div className="flex flex-col  w-full max-w-md mx-auto mt-10 p-4 rounded-lg">
          <div
            className="flex items-center gap-2 cursor-pointer mb-2"
            onClick={handleBackButtonClick}
          >
            <div className="w-[24px] h-[24px]">
              <HiOutlineArrowLeft className="text-[19px]" />
            </div>
            <h1 className="text-[26px] text-[#525252] font-semibold">
              Forgot password
            </h1>
          </div>
          <h1 className="text-[16px] text-[#525252] font-semibold mb-2">
            Please enter your email address to reset your password{" "}
          </h1>
          {/* Input Fields */}
          <div className="flex flex-col w-full space-y-4">
            <div>
              <h1 className="mb-1 text-[18px] font-semibold text-[#757575]">
                Enter your Email
              </h1>
              <div className="relative flex items-center">
                {/* Lock Icon */}
                <TbMailOpened
                  className="absolute left-3 text-[#2781B5]"
                  size={19}
                />
                {/* Input Field */}
                <input
                  readOnly
                  type="email"
                  value={user?.email}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-10 py-3 pt-4 border border-[#79CDFF] rounded-lg placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            {/* // ))} */}
          </div>

          {/* Send OTP Button */}
          <button
            className="mt-8 w-full bg-[#174C6B] text-white pt-2 rounded-lg hover:bg-[#174C6B]/80 h-[56px] text-[20px] flex justify-center items-center"
            onClick={handleSubmit}
          >
            {isLoading ? <LoadingSpinner color="white" /> : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
