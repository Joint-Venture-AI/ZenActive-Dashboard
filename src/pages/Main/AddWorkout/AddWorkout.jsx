import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
import { FaAngleLeft } from "react-icons/fa6";
import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useCreateWorkoutMutation,
  useGetAllWorkoutQuery,
} from "../../../redux/features/workout/workoutApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetAllExerciseQuery } from "../../../redux/features/exercise/exerciseApi";

const AddWorkout = () => {
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [week, setWeek] = useState(1);
  const [name, setName] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: workouts } =  useGetAllExerciseQuery(null);
  const [createWorkout, { isLoading }] = useCreateWorkoutMutation();
console.log(workouts)
  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("You can only upload image files!");
    }
  };


 let options = workouts?.data?.map(exercise=>{ return { value: exercise._id, label: exercise.name} })||[]
  // Logic for multi select input

console.log(options)
  const handleMultiSelectChange = (value) => {
    // console.log(`Selected: ${value}`);
  };

  const onFinish = async (values) => {
    const formattedData = {
      ...values,
      points: Number(values.points),
    };

    // Create FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("data", JSON.stringify(formattedData)); // Convert text fields to JSON

    try {
      const response = await createWorkout(formData).unwrap();
      if (response.success) {
        message.success("Workout created successfully!");
        form.resetFields(); // Reset form
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to create workout.");
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={handleBackButtonClick}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Add Workout</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Workout
          </h3>
          <div className="w-full px-16">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              // style={{ maxWidth: 600, margin: '0 auto' }}
            >
              {/* Section 1 */}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  size="large"
                  direction="horizontal"
                  className="responsive-space"
                >
                  {/* Name */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Workout Name
                      </span>
                    }
                    name="name"
                    className="responsive-form-item"
                    rules={[
                      { required: true, message: "Please enter workout name!" },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Workout Name"
                      style={{
                        height: "40px",
                        border: "1px solid #79CDFF",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    />
                  </Form.Item>

                  {/* Description */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Workout Description
                      </span>
                    }
                    name="description"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter workout description!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Workout Description"
                      style={{
                        height: "40px",
                        border: "1px solid #79CDFF",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    />
                  </Form.Item>

                  {/* Image */}
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
                    className=""
                    rules={[
                      {
                        required: !imageFile ? true : false,
                        message: "Please select an image!",
                      },
                    ]}
                  >
                    <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
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
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Points
                      </span>
                    }
                    name="points"
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please enter wokout points!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Points"
                      style={{
                        height: "40px",
                        border: "1px solid #79CDFF",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    />
                  </Form.Item>

                  {/* Exercises */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Select Exercise
                      </span>
                    }
                    name="exercises"
                    className="responsive-form-item"
                    rules={[
                      { required: true, message: "Please select a exercise!" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      size={"middle"}
                      placeholder="Select Exercise"
                      // defaultValue={['Vegetarian']}
                      // onChange={handleMultiSelectChange}
                      style={{
                        width: "100%",
                        height: "40px",
                      }}
                      options={options}
                    />
                  </Form.Item>
                </Space>
              </Space>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                  <button className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md ">
                    <span className="text-white font-semibold">
                      {isLoading ? <LoadingSpinner color="white" /> : "Create"}
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

export default AddWorkout;
