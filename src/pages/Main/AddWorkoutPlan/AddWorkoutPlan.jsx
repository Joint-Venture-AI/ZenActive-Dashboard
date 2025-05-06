import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { CiCamera } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5"; // Close icon
import {
  useCreateWorkoutPlanMutation,
  useGetWorkoutPlansQuery,
} from "../../../redux/features/workoutPlans/workoutPlansApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const AddWorkoutPlan = () => {
  // const [file, setFile] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null); // Hidden file input reference
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createWorkoutPlan, { isLoading }] = useCreateWorkoutPlanMutation();

  // Handle file selection
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     setPreview(URL.createObjectURL(selectedFile)); // Show image preview
  //   }
  // };

  // Handle Image Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("You can only upload image files!");
    }
  };

  // Trigger file input on button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  const onFinish = async (values) => {
    const formattedData = {
      ...values,
      points: Number(values.points),
      duration: Number(values.duration),
    };

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("data", JSON.stringify(formattedData));

      const res = await createWorkoutPlan(formData).unwrap();
      if (res.success) {
        message.success("Workout plan created successfully!");
        form.resetFields();
        navigate(-1);
      }
    } catch (err) {
      console.log(err);
      message.error("Failed to create workout plan.");
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Add Workout Plan</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Workout Plan
          </h3>
          <div className="w-full px-16">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  size="large"
                  direction="horizontal"
                  className="responsive-space"
                >
                  {/* Plan Name */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Plan Name
                      </span>
                    }
                    name="name"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the plan name!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan Name"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Plan Description */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Plan Description
                      </span>
                    }
                    name="description"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the plan description!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan Description"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Plan About */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Plan About
                      </span>
                    }
                    name="about"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter details about the plan!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan About"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Image with preview */}
                  {/* <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Upload Image
                      </span>
                    }
                    name="image"
                    className="responsive-form-item"
                  >
                    <div className="relative w-[440px]">
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-40 object-contain border border-[#79CDFF] rounded-md"
                          />
                          <IoCloseCircle
                            className="absolute top-2 right-2 text-red-600 text-2xl cursor-pointer"
                            onClick={handleRemoveImage}
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className="w-full h-10 border border-[#79CDFF] flex items-center justify-between px-4 rounded-md cursor-pointer"
                        >
                          <span className="text-base font-semibold text-[#525252]">
                            Select an image
                          </span>
                          <CiCamera size={25} color="#174C6B" />
                        </button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </Form.Item> */}

                  {/* image */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Upload Image
                      </span>
                    }
                    name="image"
                    className="responsive-form-item"
                    rules={[
                      { required: true, message: "Please upload an image!" },
                    ]}
                  >
                    <div className="relative border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        style={{ display: "none" }}
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="cursor-pointer w-full flex justify-between items-center"
                      >
                        <span className="text-[#525252] font-semibold">
                          {imageFile ? imageFile.name : "Select an image"}
                        </span>
                        <CiCamera size={25} color="#174C6B" />
                      </label>
                    </div>
                  </Form.Item>

                  {/* Points */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Points
                      </span>
                    }
                    name="points"
                    className="responsive-form-item"
                    rules={[
                      { required: true, message: "Please enter the points!" },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Points"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Duration */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Duration
                      </span>
                    }
                    name="duration"
                    className="responsive-form-item"
                    rules={[
                      { required: true, message: "Please enter the duration!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value <= 14) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Duration cannot be greater than 14")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Duration"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>
                </Space>
              </Space>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                  <button
                    type="submit"
                    className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md font-semibold"
                  >
                    {isLoading ? <LoadingSpinner color="white" /> : "Create"}
                  </button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddWorkoutPlan;
