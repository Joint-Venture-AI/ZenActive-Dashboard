import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Space } from "antd";
import { FaAngleLeft } from "react-icons/fa6";
import { message, Upload } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useDeleteBadgeMutation,
  useEditBadgeMutation,
  useGetSingleBadgeQuery,
} from "../../../redux/features/badge/badgeApi";
import { IoCloseCircle } from "react-icons/io5";
import notFoundImage from "../../../assets/images/not-found.png";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const EditBadge = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);

  const fileInputRef = useRef(null);
  const { badgeId } = useParams();
  const { data: badge } = useGetSingleBadgeQuery(badgeId);
  const [editBadge, { isLoading: editLoading }] = useEditBadgeMutation();

  // Set the initial preview image when data loads
  // useEffect(() => {
  //   if (badge?.data?.image) {
  //     setPreview(badge.data.image);
  //   }
  // }, [badge]);

  // // Handle Image Selection and Preview Update
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
      setFile(file);
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

  useEffect(() => {
    if (badge?.data) {
      form.setFieldsValue({
        name: badge.data.name,
        points: badge.data.points,
      });
    }

    if (badge?.data?.image) {
      const imageUrlParts = badge?.data?.image?.split("/");
      setImageFileName(imageUrlParts);
      setFile(badge?.data?.image);
    }
  }, [badge, form]);

  const onFinish = async (values) => {
    if (!file) {
      message.error("Please select a badge image.");
      return;
    }
    const formattedData = {
      ...values,
      points: Number(values.points), // Ensure points is a number
    };

    Object.keys(formattedData).forEach(
      (key) =>
        (formattedData[key] === "" || formattedData[key] === undefined) &&
        delete formattedData[key]
    );

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    formData.append("data", JSON.stringify(formattedData));

    try {
      const response = await editBadge({ badgeId, formData }).unwrap();
      if (response.success) {
        message.success("Badge edited successfully!");
        setFile(null);
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to edit badge.");
    }
  };

  const handleDelete = async () => {
    try {
      // Call your delete API
      const res = await deleteBadge(badgeId).unwrap();

      if (res.success) {
        message.success("Badge deleted successfully!");
        navigate(-1);
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to delete badge.");
    }
  };

  const navigate = useNavigate();

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
        <h1 className="font-semibold">Edit Badge</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Editing Badge
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
                      Badge Name
                    </span>
                  }
                  name="name"
                  className="lg:w-[482px] w-full"
                  rules={[
                    { required: true, message: "Please enter badge name!" },
                  ]}
                >
                  <Input
                    type="text"
                    //  placeholder="Enter Badge Name"
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
                      rules={[
                        {
                          required: true,
                          message: "Please select a badge image!",
                        },
                      ]}
                    >
                      <div className="relative w-[440px]">
                        {preview ? (
                          <div className="relative">
                            <img
                              src={
                                preview === badge?.data?.image
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
                      message: "Please select badge image!",
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

                {/* points */}
                <Form.Item
                  label={
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#2D2D2D",
                      }}
                    >
                      Points To Achieve
                    </span>
                  }
                  name="points"
                  className="responsive-form-item-section-2"
                  rules={[{ required: true, message: "Please enter points!" }]}
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
              </Space>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center gap-10">
                  {/* <button
                    type="button"
                    className="w-[500px] border border-[#1E648C]/60 bg-[#EBF8FF] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md"
                    onClick={() => handleDelete()}
                  >
                    <span className="text-[#1E648C] font-semibold">
                      {deleteLoading ? (
                        <LoadingSpinner color="#436F88" />
                      ) : (
                        "Delete"
                      )}
                    </span>
                  </button> */}
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

export default EditBadge;
