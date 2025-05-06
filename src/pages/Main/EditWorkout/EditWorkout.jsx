import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Space } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { message } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useDeleteWorkoutMutation,
  useEditWorkoutMutation,
  useGetAllWorkoutQuery,
  useGetSingleWorkoutQuery,
} from "../../../redux/features/workout/workoutApi";
import { IoCloseCircle } from "react-icons/io5";
import notFoundImage from "../../../assets/images/not-found.png";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const EditWorkout = () => {
  const [file, setFile] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("Select an image");

  const fileInputRef = useRef(null);

  const [form] = Form.useForm();
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const { data: workout, refetch } = useGetSingleWorkoutQuery(workoutId);
  const [editWorkout, { isLoading: editLoading }] = useEditWorkoutMutation();
  const [deleteWorkout, { isLoading: deleteLoading }] =
    useDeleteWorkoutMutation();
  const { data: workouts } = useGetAllWorkoutQuery(null);

  // Set the initial preview image when data loads
  // useEffect(() => {
  //   if (workout?.data?.image) {
  //     setPreview(workout.data.image);
  //   }
  // }, [workout]);

  // Handle Image Selection and Preview Update
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     setPreview(URL.createObjectURL(selectedFile)); // Show new image preview
  //   }
  // };

  // Handle Image Upload
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

  // Logic for multi select input
//   const { data: workouts } =  useGetAllExerciseQuery(null);



  const options =
    workout?.data?.exercises.map((exercise) => ({
      value: exercise._id, // Value stored in the database
      label: exercise.name, // Displayed in the UI
    })) || [];

  const allExercises =
  workouts?.data?.map(exercise=>{ return { value: exercise._id, label: exercise.name} })||[]
  // const handleMultiSelectChange = (value) => {
  //   console.log(`Selected: ${value}`);
  // };

  const onFinish = async (values) => {
    // Create FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("data", JSON.stringify(values)); // Convert text fields to JSON

    try {
      const response = await editWorkout({ workoutId, formData }).unwrap();

      if (response.success) {
        message.success("workout edited successfully!");
        form.resetFields(); // Reset form
        setFile(null); // Clear file
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to edit workout.");
    }
  };

  const handleDelete = async () => {
    try {
      // Call your delete API
      await deleteWorkout(workoutId).unwrap();
      message.success("workout deleted successfully!");
      navigate(-1); // Navigate back after deletion
    } catch (error) {
      message.error(error.data?.message || "Failed to delete workout.");
    }
  };

  useEffect(() => {
    if (workout?.data) {
      form.setFieldsValue({
        name: workout.data.name,
        description: workout.data.description,
        points: workout.data.points,
        exercises: workout.data.exercises.map((exercise) => exercise._id),
      });
    }

    if (workout?.data?.image) {
      const imageUrlParts = workout?.data?.image.split("/");
      setImageFileName(imageUrlParts[imageUrlParts.length - 1]);
      setImageFile(workout?.data?.image);
    }
  }, [workout, form]);

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
        <h1 className="font-semibold">Edit Workout</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Editing Workout
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
                      {
                        required: true,
                        message: "Please select workout name!",
                      },
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
                        message: "Please write a description about workout!",
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
                            src={
                              preview === workout?.data?.image
                                ? import.meta.env.VITE_BASE_URL + preview
                                : preview
                            }
                            alt="Preview"
                            className="w-full h-40 object-contain border border-[#79CDFF] rounded-md"
                            onError={(e) => (e.target.src = notFoundImage)}
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

                  {/* Image */}
                  <Form.Item
                    label="Upload Image"
                    name="image"
                    className=""
                    rules={[
                      {
                        required: !imageFileName ? true : false,
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
                          {imageFileName}
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
                      { required: true, message: "Please enter points!" },
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
                    initialValue={options}
                  >
                    <Select
                      mode="multiple"
                      size={"middle"}
                      placeholder="Select Exercise"
                      // defaultValue={['Vegetarian']}
                      //   onChange={handleMultiSelectChange}
                      style={{
                        width: "100%",
                      }}
                      options={allExercises}
                    />
                  </Form.Item>
                </Space>
              </Space>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center gap-10">
                  <button
                    type="button"
                    className="w-[500px] border border-[#1E648C]/60 bg-[#EBF8FF] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md "
                    onClick={() => handleDelete()}
                  >
                    <span className="text-[#1E648C] font-semibold">
                      {deleteLoading ? (
                        <LoadingSpinner color="#436F88" />
                      ) : (
                        "Delete"
                      )}
                    </span>
                  </button>
                  <button
                    type="submit"
                    className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md "
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

export default EditWorkout;
