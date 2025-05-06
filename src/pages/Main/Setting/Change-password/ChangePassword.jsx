import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineArrowLeft } from "react-icons/hi";
import { useUpdatePasswordMutation } from "../../../../redux/features/auth/authApi";
import { useState } from "react";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../../Components/LoadingSpinner";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response?.data?.status == 200) {
        navigate(-1);
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
      <div className="bg-[#F4F9FB] rounded-lg shadow-lg mt-8 w-[610px] h-[725px] mx-auto py-10 px-8">
        <div className="flex flex-col w-full max-w-md mx-auto mt-10 p-4 rounded-lg">
          <div className="space-y-[10px] mb-[30px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleBackButtonClick}
            >
              <div className="w-[24px] h-[24px]">
                <HiOutlineArrowLeft className="text-[19px]" />
              </div>
              <h1 className="text-[26px] text-[#525252] font-semibold">
                Change password
              </h1>
            </div>
            <h1 className="text-[20px] text-[#525252] font-semibold">
              Your password must be 8-10 character long.
            </h1>
          </div>
          {/* Input Fields */}
          <div className="flex flex-col w-full space-y-4">
            {[
              {
                label: "Enter old password",
                placeholder: "Enter old password",
                value: oldPassword,
                setValue: setOldPassword,
                show: showPassword.old,
                setShow: setShowPassword,
                name: "old_password",
                key: "old",
              },
              {
                label: "Set new password",
                placeholder: "Set new password",
                value: newPassword,
                setValue: setNewPassword,
                show: showPassword.new,
                setShow: setShowPassword,
                name: "new_password",
                key: "new",
              },
              {
                label: "Re-enter new password",
                placeholder: "Re-enter new password",
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
                  <h1 className="mb-[5px] text-[20px] text-[#4B4B4B] font-semibold">
                    {label}
                  </h1>
                  <div key={index} className="relative flex items-center">
                    {/* Lock Icon */}
                    <div className="absolute left-3 text-[#2781B5] w-[20px] h-[20px]">
                      <HiOutlineLockClosed size={19} className="" />
                    </div>
                    {/* Input Field */}
                    <input
                      type={show ? "text" : "password"}
                      name={name}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-[487px] pl-10 pr-10 h-[54px] pt-[3px] border border-[#79CDFF] rounded-lg placeholder:text-[16px] placeholder:font-semibold placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    {/* Eye Icon */}
                    <div
                      className="absolute right-8 cursor-pointer font-bold"
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

          {/* Forgot Password */}
          <p
            className="mt-[12px] text-[16px] text-[#2781B5] font-semibold ml-auto mr-4 cursor-pointer hover:underline"
            onClick={(e) => navigate(`forgot-password`)}
          >
            Forgot Password?
          </p>

          {/* Update Password Button */}
          <button
            className="mt-6 w-full bg-[#174C6B] text-white h-[56px] rounded-lg hover:bg-[#174C6B]/80 text-[20px] pt-1 flex justify-center items-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner color="white" /> : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
