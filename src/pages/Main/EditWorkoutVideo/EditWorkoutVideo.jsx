import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Space } from "antd";
const { Option } = Select;
import { FaAngleLeft } from "react-icons/fa6";
import { message } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useEditWorkoutVideoMutation,
  useGetSingleWorkoutVideoQuery,
} from "../../../redux/features/workoutVideo/workoutVideoApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const EditWorkoutVideo = () => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("Select an image");
  const [videoFileName, setVideoFileName] = useState("Select a video");
  const [videoResolution, setVideoResolution] = useState(null);
  const [needsConversion, setNeedsConversion] = useState(false);

  const navigate = useNavigate();
  const { workoutId } = useParams();

  const { data: workoutVideo } = useGetSingleWorkoutVideoQuery(workoutId);
  const [editWorkoutVideo, { isLoading: editLoading }] =
    useEditWorkoutVideoMutation();

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

  useEffect(() => {
    if (workoutVideo?.data) {
      form.setFieldsValue({
        name: workoutVideo.data.name,
      });

      // Set existing image filename
      if (workoutVideo?.data?.image) {
        const imageUrlParts = workoutVideo?.data?.image.split("/");
        setImageFileName(imageUrlParts[imageUrlParts.length - 1]);
      }

      // Set existing video filename
      if (workoutVideo?.data?.video) {
        const videoUrlParts = workoutVideo?.data?.video.split("/");
        setVideoFileName(videoUrlParts[videoUrlParts.length - 1]);
      }
    }
  }, [workoutVideo, form]);

  const onFinish = async (values) => {
    // Create FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (videoFile) {
      formData.append("media", videoFile);
    }
    formData.append("data", JSON.stringify(values)); // Convert text fields to JSON

    try {
      const response = await editWorkoutVideo({ workoutId, formData }).unwrap();
      if (response.success) {
        message.success("Video edited successfully!");
        form.resetFields(); // Reset form
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      message.error(error.data?.message || "Failed to edit video.");
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
        <h1 className="font-semibold">Edit Workout Video</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[70vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Editing Workout Video
          </h3>
          <div className="w-full px-5 lg:px-16">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              // style={{ maxWidth: 600, margin: '0 auto' }}
            >
              <Space
                size="large"
                direction="horizontal"
                className="responsive-space-section-2"
              >
                {/* Video */}
                <Form.Item label="Upload Video" name="media" className="">
                  <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
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
                        This video is larger than 720p, please upload a video in
                        720p or lower
                      </p>
                    ) : (
                      // <p className="text-amber-600">This video is larger than 720p and needs to be converted</p>
                      <p className="text-green-600">
                        This video is in good shape
                      </p>
                    )}
                  </div>
                )}

                {/* Thumbnail */}
                <Form.Item label="Upload Image" name="image" className="">
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

                {/* Title */}
                <Form.Item
                  label={
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#2D2D2D",
                      }}
                    >
                      Video Title
                    </span>
                  }
                  name="name"
                  className="responsive-form-item-section-2"
                >
                  <Input
                    type="text"
                    placeholder="Enter video title"
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

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center gap-10">
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

export default EditWorkoutVideo;
