import React, { useState, useRef } from "react";
import { Button, Form, Input, message } from "antd";
import dashProfile from "../../assets/images/avatar.png";
import { FaAngleLeft } from "react-icons/fa6";
import { IoMdCamera } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEditProfileMutation } from "../../redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/features/auth/authSlice";
import LoadingSpinner from "../../Components/LoadingSpinner";

const EditMyProfile = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // Reference for file input
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = useSelector(useCurrentUser);
  const token = useSelector(useCurrentToken);
  // console.log(token);
  const dispatch = useDispatch();

  const [editProfile, { isLoading: updateLoading }] = useEditProfileMutation();

  // Handle file selection and show preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Set preview URL
    }
  };

  // Trigger file input on overlay click
  const handleOverlayClick = () => {
    fileInputRef.current.click();
  };

  const handleBackButtonClick = () => {
    navigate(-1); // Navigate back
  };

  const onFinish = async (values) => {
    const formattedData = {
      mobile: values.phone || user.phone || "",
    };

    // Create FormData
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("data", JSON.stringify(formattedData));

    try {
      const res = await editProfile(formData).unwrap();

      if (res.success) {
        dispatch(setUser({ user: res?.data, token }));
        message.success("Profile update successful!");
        form.resetFields();
        setFile(null);
        setPreview(null);
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to edit profile.");
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={handleBackButtonClick}
      >
        <FaAngleLeft />
        <h1>Personal Information Edit</h1>
      </div>
      <div className="rounded-lg py-4 border-[#174C6B]/40 border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 pl-5 border-b-2 border-[#174C6B]/40 pb-3">
            Personal Information Edit
          </h3>
          <div className="w-full">
            <Form
              name="edit-profile"
              layout="vertical"
              className="w-full grid grid-cols-12 gap-x-10 px-14 py-8"
              onFinish={onFinish}
              autoComplete="off"
              initialValues={{
                name: "Admin",
                phone: user.mobile || "N/A",
              }}
            >
              <div className="col-span-3 space-y-6">
                <div className="min-h-[300px] flex flex-col items-center justify-center p-8 border border-black bg-lightGray/15 relative">
                  {/* Profile Image and Overlay */}
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleOverlayClick}
                  >
                    <img
                      src={
                        preview ||
                        `${import.meta.env.VITE_BASE_URL_IMAGE}${user?.image}`
                      }
                      alt="Profile"
                      className="h-28 w-28 rounded-full border-4 border-black object-cover"
                      onError={(e) => (e.target.src = dashProfile)}
                    />
                    <div className="absolute top-0 w-full h-full bg-[#174C6B]/50 p-2 rounded-full hidden group-hover:flex justify-center items-center">
                      <IoMdCamera size={23} color="white" />
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <h5 className="text-lg text-[#222222]">Profile</h5>
                  <h4 className="text-2xl text-[#222222]">Admin</h4>
                </div>
              </div>
              <div className="col-span-9 space-y-[14px] w-full">
                <Form.Item label="Name" name="name">
                  <Input
                    size="large"
                    className="h-[53px] rounded-lg"
                    readOnly
                    value="Admin"
                  />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone">
                  <Input
                    type="tel"
                    size="large"
                    className="h-[53px] rounded-lg"
                  />
                </Form.Item>
                <Form.Item className="flex justify-end pt-4">
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="px-8 bg-[#174C6B] text-white hover:bg-black/90 rounded-xl font-semibold h-11"
                  >
                    {updateLoading ? (
                      <LoadingSpinner color="white" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMyProfile;
