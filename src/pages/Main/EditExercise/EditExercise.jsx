import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Checkbox, Form, Input, Space } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { message } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useDeleteExerciseMutation,
  useEditExerciseMutation,
  useGetSingleExerciseQuery,
} from "../../../redux/features/exercise/exerciseApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const EditExercise = () => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("Select an image");
  const [videoFileName, setVideoFileName] = useState("Select a video");
  const [videoResolution, setVideoResolution] = useState(null);
  const [needsConversion, setNeedsConversion] = useState(false);

  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const { data: exercise } = useGetSingleExerciseQuery(exerciseId);

  const [editExercise, { isLoading: editLoading }] = useEditExerciseMutation();
  const [deleteExercise, { isLoading: deleteLoading }] =
    useDeleteExerciseMutation();

  useEffect(() => {
    if (exercise?.data) {
      form.setFieldsValue({
        name: exercise.data.exercise.name,
        about: exercise.data.exercise.about,
        description: exercise.data.exercise.description,
        points: exercise.data.exercise.points,
        duration: exercise.data.exercise.duration,
        goal: exercise.data.exercise.goal,
        reps: exercise.data.exercise.reps,
        sets: exercise.data.exercise.sets,
        restTime: exercise.data.exercise.restTime,
        isPremium: exercise.data.exercise.isPremium,
      });

      // Set existing image filename
      if (exercise.data.exercise.image) {
        const imageUrlParts = exercise.data.exercise.image.split("/");
        setImageFileName(imageUrlParts[imageUrlParts.length - 1]);
      }

      // Set existing video filename
      if (exercise.data.exercise.video) {
        const videoUrlParts = exercise.data.exercise.video.split("/");
        setVideoFileName(videoUrlParts[videoUrlParts.length - 1]);
      }
    }
  }, [exercise, form]);

  // Check video resolution
  const checkVideoResolution = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const width = video.videoWidth;
        const height = video.videoHeight;
        resolve({ width, height });
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Handle Video Upload
  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("video/")) {
      alert("You can only upload video files!");
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);

    // Check video resolution
    const { width, height } = await checkVideoResolution(file);
    setVideoResolution({ width, height });

    // Determine if conversion is needed (if resolution is higher than 720p)
    const needsConversion = height > 720;
    setNeedsConversion(needsConversion);

    // console.log(
    //   `Video resolution: ${width}x${height}, needs conversion: ${needsConversion}`
    // );
  };

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

  const onFinish = async (values) => {
    const formattedData = {
      ...values,
      points: Number(values.points),
      duration: Number(values.duration),
      reps: Number(values.reps),
      sets: Number(values.sets),
      restTime: Number(values.restTime),
    };
    // Create FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (videoFile) {
      formData.append("media", videoFile);
    }
    formData.append("data", JSON.stringify(formattedData)); // Convert text fields to JSON

    try {
      const response = await editExercise({ exerciseId, formData }).unwrap();

      if (response.success) {
        message.success("exercise edited successfully!");
        form.resetFields(); // Reset form
        // setFile(null); // Clear file
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      message.error(error.data?.message || "Failed to edit exercise.");
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const handleDelete = async () => {
    try {
      // Call your delete API
      const res = await deleteExercise(exerciseId).unwrap();
      if (res.success) {
        message.success("exercise deleted successfully!");
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to delete exercise.");
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={handleBackButtonClick}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Edit Exercise</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Editing Exercise
          </h3>
          <div className="w-full px-16">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              // style={{ maxWidth: 600, margin: '0 auto' }}
            >
              {/* Section 1 */}
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                  borderBottom: "1px solid #79CDFF",
                  paddingBottom: "32px",
                }}
              >
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
                        Exercise Name
                      </span>
                    }
                    name="name"
                    className=""
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Exercise Name"
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

                  {/* about */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        About Exercise
                      </span>
                    }
                    name="about"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="About Exercise"
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
                        Exercise Description
                      </span>
                    }
                    name="description"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Exercise Description"
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
                  <Form.Item label="Upload Image" name="image" className="">
                    <div className="relative lg:w-[440px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
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

                  {/* Video */}
                  <Form.Item label="Upload Video" name="media" className="">
                    <div className="relative lg:w-[440px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="videoUpload"
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="videoUpload"
                        className="cursor-pointer w-full flex justify-between items-center"
                      >
                        <span className="text-[#525252] font-semibold">
                          {videoFileName}
                        </span>
                        <CiCamera size={25} color="#174C6B" />
                      </label>
                    </div>
                  </Form.Item>
                  {videoResolution && (
                    <div className="mt-2 text-sm">
                      <p>
                        Resolution: {videoResolution.width}x
                        {videoResolution.height}
                      </p>
                      {needsConversion ? (
                        <p className="text-amber-600">
                          This video is larger than 720p, please upload a video
                          in 720p or lower
                        </p>
                      ) : (
                        // <p className="text-amber-600">This video is larger than 720p and needs to be converted</p>
                        <p className="text-green-600">
                          This video is in good shape
                        </p>
                      )}
                    </div>
                  )}
                </Space>
              </Space>

              {/* Section 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div>
                  <h1 className="text-[18px] font-semibold pb-3">
                    Information
                  </h1>
                  <Space
                    size="large"
                    direction="horizontal"
                    className="responsive-space-section-2"
                  >
                    {/* Duration */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Duration
                        </span>
                      }
                      name="duration"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Set duration"
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
                          Reward Points
                        </span>
                      }
                      name="points"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Set reward point"
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

                    {/* Goal */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Goal
                        </span>
                      }
                      name="goal"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="text"
                        placeholder="Set goal"
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

                    {/* Reps */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Reps
                        </span>
                      }
                      name="reps"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Set Reps"
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

                    {/* Sets */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Sets
                        </span>
                      }
                      name="sets"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Set sets"
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

                    {/* Rest time */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Rest Time
                        </span>
                      }
                      name="restTime"
                      className="responsive-form-item-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Set rest time"
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
                  </Space>

                  {/* is premium */}
                  <Form.Item
                    name="isPremium"
                    valuePropName="checked"
                    required={true}
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Is Premium
                      </span>
                    }
                    className="mt-10"
                  >
                    <Checkbox>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Premium
                      </span>
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>

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

export default EditExercise;
