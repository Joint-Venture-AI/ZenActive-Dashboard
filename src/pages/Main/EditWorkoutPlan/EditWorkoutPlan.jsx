import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { CiCamera } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5"; // Close icon
import {
  useDeleteWorkoutPlanMutation,
  useEditWorkoutPlanMutation,
  useGetSingleWorkoutPlanQuery,
} from "../../../redux/features/workoutPlans/workoutPlansApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import notFoundImage from "../../../assets/images/not-found.png";

const EditWorkoutPlan = () => {
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const fileInputRef = useRef(null); // Hidden file input reference
  const [form] = Form.useForm();
  const { workoutPlanId } = useParams();
  const navigate = useNavigate();

  const { data: workoutPlan, refetch } =
    useGetSingleWorkoutPlanQuery(workoutPlanId);
  const [editWorkoutPlan, { isLoading: editLoading }] =
    useEditWorkoutPlanMutation();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImageFileName(file.name);
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
    };

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("data", JSON.stringify(formattedData));

    try {
      const res = await editWorkoutPlan({ workoutPlanId, formData }).unwrap();

      if (res.success) {
        message.success("Workout plan edited successfully!");
        form.resetFields();
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to edit workout plan.");
    }
  };

  useEffect(() => {
    if (workoutPlan?.data) {
      form.setFieldsValue({
        name: workoutPlan.data.name,
        description: workoutPlan.data.description,
        points: workoutPlan.data.points,
      });

      if (workoutPlan?.data?.image) {
        const imageUrlParts = workoutPlan?.data?.image.split("/");
        setImageFileName(imageUrlParts[imageUrlParts.length - 1]);
        setImageFile(workoutPlan?.data?.image);
      }
    }
  }, [workoutPlan, form]);

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Edit Workout Plan</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Editing Workout Plan
          </h3>
          <div className="w-full px-16">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  size="large"
                  direction="horizontal"
                  className="responsive-space"
                >
                  {/* Name */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Workout Name
                      </span>
                    }
                    name="name"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the workout name!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Workout Name"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Description */}
                  <Form.Item
                    label={
                      <span className="text-lg font-semibold text-[#2D2D2D]">
                        Workout Description
                      </span>
                    }
                    name="description"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the workout description!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Workout Description"
                      className="h-10 border-[#79CDFF] text-base font-semibold text-[#525252]"
                    />
                  </Form.Item>

                  {/* Image */}
                  <Form.Item
                    label="Upload Image"
                    name="image"
                    className=""
                    rules={[
                      {
                        required: !imageFileName ? true : false,
                        message: "Please upload an image!",
                      },
                    ]}
                  >
                    <div className="relative https://github.com/Joint-Venture-AI/ZenActive_Backend border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
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
                          {imageFileName}
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
                </Space>
              </Space>

              {/* Submit & Delete Buttons */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center gap-10">
                  <button
                    type="submit"
                    className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md"
                  >
                    <span className="text-white font-semibold">
                      {editLoading ? (
                        <LoadingSpinner color="white" />
                      ) : (
                        "Update"
                      )}
                    </span>
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

export default EditWorkoutPlan;
