import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Form, Input, Button, Space, Checkbox } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { message } from "antd";
import { CiCamera } from "react-icons/ci";
import { useCreateExerciseMutation } from "../../../redux/features/exercise/exerciseApi";
import { IoVideocamOutline } from "react-icons/io5";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { compressImage } from "../../../utils/imageCompression";
import axios from "axios";

const AddExercise = () => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoResolution, setVideoResolution] = useState(null);
  const [needsConversion, setNeedsConversion] = useState(false);
  
  const navigate = useNavigate();

  const [createExercise] = useCreateExerciseMutation();

  const fetchCloudinarySignature = async () => {
    // Get token from auth state or local storage to include in headers
    const token = localStorage.getItem("token");
    
    console.log("Fetching signature from:", `${import.meta.env.VITE_BASE_URL}/exercise/signature?folder=exercises`);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/exercise/signature?folder=exercises`,
        {
          headers: {
              Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Full signature response:", response);
      if (!response.data) {
          throw new Error("No data in signature response");
      }
      return response.data;
    } catch (error) {
        console.error("Signature fetch error:", error.response || error);
        throw error;
    }
  };

  const uploadToCloudinaryDirect = async (file, folder, resourceType) => {
    const sigResult = await fetchCloudinarySignature();
    const { timestamp, signature, cloudName, apiKey, folder: signedFolder } = sigResult.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", signedFolder);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType === "image" ? "image" : "video"}/upload`,
      formData
    );
    return response.data;
  };
  
  const onFinish = async (values) => {
    setIsUploading(true);
    const loadingMessage = message.loading("Uploading media to cloud... Please wait.", 0);
    
    try {
      let videoUrl = null;
      let imageUrl = null;
      let videoId = null;

      // Direct Uploads
      if (imageFile) {
        const compressedImage = await compressImage(imageFile);
        const imgRes = await uploadToCloudinaryDirect(compressedImage, "exercises/images", "image");
        imageUrl = imgRes.secure_url;
      }
      
      if (videoFile) {
        const vidRes = await uploadToCloudinaryDirect(videoFile, "exercises/videos", "video");
        videoUrl = vidRes.secure_url;
        videoId = vidRes.public_id;
      }

      const formattedData = {
        ...values,
        points: Number(values.points),
        duration: Number(values.duration),
        reps: Number(values.reps),
        sets: Number(values.sets),
        restTime: Number(values.restTime),
        image: imageUrl,
        video: videoUrl,
        videoId: videoId
      };

      const response = await createExercise(formattedData).unwrap();
      if (response.success) {
        message.success("Exercise added successfully!");
        form.resetFields();
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to add exercise.");
    } finally {
      loadingMessage(); // Dismiss the loading message
      setIsUploading(false);
    }
  };

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

    // Check video resolution
    const { width, height } = await checkVideoResolution(file);
    setVideoResolution({ width, height });

    // Determine if conversion is needed (if resolution is higher than 720p)
    const needsConversion = height > 720;
    setNeedsConversion(needsConversion);
  };

  // Handle Image Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("You can only upload image files!");
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
        <h1 className="font-semibold">Add Exercise</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Exercise
          </h3>
          <div className="w-full px-16">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
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
                    className="responsive-form-item"
                    rules={[
                      {
                        required: true,
                        message: "Please select exercise name!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Exercise Name"
                      disabled={isUploading}
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
                    rules={[
                      {
                        required: true,
                        message: "Please write about exercise!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="About Exercise"
                      disabled={isUploading}
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
                    rules={[
                      {
                        required: true,
                        message: "Please write about exercise description!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Exercise Description"
                      disabled={isUploading}
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
                      { required: true, message: "Please select an image!" },
                    ]}
                  >
                    <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="hidden"
                        style={{ display: "none" }}
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className={`cursor-pointer w-full flex justify-between items-center ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className="text-[#525252] font-semibold">
                          {imageFile ? imageFile.name : "Select an image"}
                        </span>
                        <CiCamera size={25} color="#174C6B" />
                      </label>
                    </div>
                  </Form.Item>

                  {/* Video */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Upload Video
                      </span>
                    }
                    name="media"
                    className=""
                    rules={[
                      { required: true, message: "Please select a video!" },
                    ]}
                  >
                    <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center  px-2 py-3 rounded-md">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        disabled={isUploading}
                        className="hidden"
                        id="videoUpload"
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="videoUpload"
                        className={`cursor-pointer w-full flex justify-between items-center ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className="text-[#525252] font-semibold">
                          {videoFile ? videoFile.name : "Select a video"}
                        </span>
                        <IoVideocamOutline size={20} color="#174C6B" />
                      </label>
                    </div>
                  </Form.Item>
                  {/* Video Resolution Info */}
                  {videoResolution && (
                    <div className="mt-2 text-sm">
                      <p>
                        Resolution: {videoResolution.width}x
                        {videoResolution.height}
                      </p>
                      {needsConversion ? (
                        <p className="text-amber-600">
                          Note: High-resolution videos (above 720p) take much longer to upload. 
                          For faster performance, we recommend using 720p.
                        </p>
                      ) : (
                        <p className="text-green-600">
                          Video resolution is optimal for fast upload.
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
                      rules={[
                        { required: true, message: "Please select duration!" },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Set duration"
                        disabled={isUploading}
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
                      rules={[
                        {
                          required: true,
                          message: "Please select exercise points!",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Set reward point"
                        disabled={isUploading}
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
                      rules={[
                        { required: true, message: "Please select goal!" },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="Set goal"
                        disabled={isUploading}
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
                      rules={[
                        { required: true, message: "Please select reps!" },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Set Reps"
                        disabled={isUploading}
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
                      rules={[
                        { required: true, message: "Please select sets!" },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Set sets"
                        disabled={isUploading}
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
                      rules={[
                        { required: true, message: "Please select rest time!" },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Set rest time"
                        disabled={isUploading}
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
                    <Checkbox disabled={isUploading}>
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
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className={`w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-white font-semibold">
                      {isUploading ? <LoadingSpinner color="white" /> : "Create"}
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

export default AddExercise;
