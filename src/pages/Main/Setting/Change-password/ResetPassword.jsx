import React, { useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../../../redux/features/auth/authApi";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../../Components/LoadingSpinner";

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [resetPassword, { isLoading }] = useChangePasswordMutation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await resetPassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
        // token: token,
      });

      if (response?.data?.status == 200) {
        localStorage.removeItem("verify-token");
        navigate("/settings");
        Swal.fire({
          icon: "success",
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "failed!",
          text:
            response?.data?.message ||
            response?.error?.data?.message ||
            "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed !!",
        text: "Something went wrong.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#F4F9FB] rounded-lg shadow-lg mt-8 w-[630px] h-[450px] mx-auto py-10 px-8">
        <div className="flex flex-col w-full max-w-xl mx-auto p-4 rounded-lg">
          <div className="space-y-[10px] mb-[24px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleBackButtonClick}
            >
              <div className="w-[24px] h-[24px]">
                <HiOutlineArrowLeft className="text-[19px]" />
              </div>
              <h1 className="text-[26px] text-[#525252] font-semibold">
                Reset Password
              </h1>
            </div>
            <h1 className="text-[16px] text-[#525252]">
              Your password must be 8-10 character long.
            </h1>
          </div>
          {/* Input Fields */}
          <div className="flex flex-col w-full space-y-[24px]">
            {[
              {
                label: "Set your password",
                placeholder: "Set your password",
                value: newPassword,
                setValue: setNewPassword,
                show: showPassword.new,
                setShow: setShowPassword,
                name: "new_password",
                key: "new",
              },
              {
                label: "Re-enter password",
                placeholder: "Re-enter password",
                value: confirmPassword,
                setValue: setConfirmPassword,
                show: showPassword.confirm,
                setShow: setShowPassword,
                name: "confirm_password",
                key: "confirm",
              },
            ].map(
              (
                {
                  label,
                  placeholder,
                  value,
                  setValue,
                  show,
                  setShow,
                  name,
                  key,
                },
                index
              ) => (
                <div key={index}>
                  {/* <h1 className="mb-[5px] text-[20px] text-[#4B4B4B] font-semibold">{label}</h1> */}
                  <div key={index} className=" flex items-center relative">
                    {/* Input Field */}
                    <input
                      type={show ? "text" : "password"}
                      name={name}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-[487px] pl-[12px] pr-10 h-[54px] pt-[3px] border border-[#79CDFF] rounded-lg placeholder:text-[16px] placeholder:font-semibold placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    {/* Eye Icon */}
                    <div
                      className="absolute right-16 cursor-pointer font-bold"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    >
                      {show ? (
                        <HiOutlineEye size={15} />
                      ) : (
                        <HiOutlineEyeSlash size={15} />
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Update Password Button */}
          <div className="flex items-center justify-center">
            <button
              className="mt-6 w-[400px] bg-[#174C6B] text-white h-[56px] rounded-lg hover:bg-[#174C6B]/80 text-[20px] pt-1 flex justify-center items-center"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner color="white" /> : "Reset password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
