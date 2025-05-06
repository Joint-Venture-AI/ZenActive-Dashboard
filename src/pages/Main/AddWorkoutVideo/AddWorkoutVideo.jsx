import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Select, Space } from "antd";
const { Option } = Select;
import { FaAngleLeft } from "react-icons/fa6";
import { message, Upload } from "antd";
import { CiCamera } from "react-icons/ci";
import { IoVideocamOutline } from "react-icons/io5";
import { useCreateWorkoutVideoMutation } from "../../../redux/features/workoutVideo/workoutVideoApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const AddWorkoutVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const [createWorkoutVideo, { isLoading }] = useCreateWorkoutVideoMutation();

  // Handle Video Upload
  const handleVideoChange = ({ file }) => {
    setVideoFile(file.originFileObj);
  };

  // Handle Image Upload
  const handleImageChange = ({ file }) => {
    setImageFile(file.originFileObj);
  };

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
      const response = await createWorkoutVideo(formData).unwrap();
      console.log(response, "response from add video");
      if (response.success) {
        message.success("Video added successfully!");
        form.resetFields(); // Reset form
        setFile(null); // Clear file
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to add video.");
    }
  };
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const videoUploadProps = {
    name: "video",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
      }
      return isVideo;
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} video uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} video upload failed.`);
      }
    },
  };

  const imageUploadProps = {
    name: "image",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      return isImage;
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} image uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} image upload failed.`);
      }
    },
  };
  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={handleBackButtonClick}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Add Video</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Video
          </h3>
          <div className="w-full px-16">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              // style={{ maxWidth: 600, margin: '0 auto' }}
            >
              {/* Section 1 */}
              {/* <Space direction="vertical" style={{ width: '100%' }}> */}
              {/* <Space size="large" direction="horizontal" className="responsive-space"> */}
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <Space
                    size="large"
                    direction="horizontal"
                    className="responsive-space-section-2"
                  >
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
                      className="responsive-form-item"
                      // rules={[{ required: true, message: 'Please enter the package amount!' }]}
                    >
                      <Upload
                        {...videoUploadProps}
                        onChange={handleVideoChange}
                        maxCount={1}
                      >
                        <Button
                          style={{
                            width: "440px",
                            height: "40px",
                            border: "1px solid #79CDFF",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#525252",
                              fontSize: "16px",
                              fontWeight: 600,
                            }}
                          >
                            Select a video
                          </span>
                          <IoVideocamOutline size={20} color="#174C6B" />
                        </Button>
                      </Upload>
                    </Form.Item>

                    {/* Thumbnail */}
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
                      // rules={[{ required: true, message: 'Please enter the package amount!' }]}
                    >
                      <Upload
                        {...imageUploadProps}
                        onChange={handleImageChange}
                        maxCount={1}
                      >
                        <Button
                          style={{
                            width: "440px",
                            height: "40px",
                            border: "1px solid #79CDFF",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#525252",
                              fontSize: "16px",
                              fontWeight: 600,
                            }}
                          >
                            Select an image
                          </span>
                          <CiCamera size={25} color="#174C6B" />
                        </Button>
                      </Upload>
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
                </div>
              </div>

              {/* </Space> */}
              {/* </Space> */}

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                  <button className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md ">
                    <span className="text-white font-semibold">
                      {isLoading ? <LoadingSpinner color="white" /> : "Upload"}
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

export default AddWorkoutVideo;
