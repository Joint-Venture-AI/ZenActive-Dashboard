import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Space } from "antd";
const { Option } = Select;
import { FaAngleLeft } from "react-icons/fa6";
import { message } from "antd";
import { CiCamera } from "react-icons/ci";
import {
  useDeleteMealMutation,
  useEditMealMutation,
  useGetSingleMealQuery,
} from "../../../redux/features/meal/mealApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const EditMeal = () => {
  // const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("Select an image");

  const [form] = Form.useForm();
  const { mealId } = useParams();
  const { data: meal } = useGetSingleMealQuery(mealId, {
    skip: !mealId, // Skip fetching when mealId is deleted
  });
  const navigate = useNavigate();

  const [editMeal, { isLoading: editLoading }] = useEditMealMutation();

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

  // Logic for multi select input
  const options = [
    { value: "Vegan", label: "Vegan" },
    { value: "Vegetarian", label: "Vegetarian" },
    { value: "No Preference", label: "No Preference" },
    { value: "Keto/Low Carb", label: "Keto/Low Carb" },
    { value: "Gluten-Free", label: "Gluten-Free" },
  ];

  const handleMultiSelectChange = (value) => {
    // console.log(`Selected: ${value}`);
  };

  useEffect(() => {
    if (meal?.data) {
      form.setFieldsValue({
        mealName: meal.data.mealName,
        mealTime: meal.data.mealTime,
        category: meal.data.category,
        suitableFor: meal.data.suitableFor,
        amount: meal.data.amount,
        calories: meal.data.nutritionalInfo.calories,
        carbs: meal.data.nutritionalInfo.carbs,
        proteins: meal.data.nutritionalInfo.proteins,
        fats: meal.data.nutritionalInfo.fats,
      });

      if (meal?.data?.image) {
        const imageUrlParts = meal?.data?.image.split("/");
        setImageFileName(imageUrlParts[imageUrlParts.length - 1]);
        setImageFile(meal?.data?.image);
      }
    }
  }, [meal, form]);

  const onFinish = async (values) => {
    // Restructure the form data to include nutritionalInfo
    const formattedData = {
      ...values, // Spread other fields
      nutritionalInfo: {
        calories: Number(values.calories),
        carbs: Number(values.carbs),
        proteins: Number(values.proteins),
        fats: Number(values.fats),
      },
    };

    // Create FormData
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("data", JSON.stringify(formattedData)); // Convert text fields to JSON

    try {
      const response = await editMeal({ mealId, formData }).unwrap();
      if (response.success) {
        message.success("Meal edited successfully!");
        form.resetFields(); // Reset form
        navigate(-1);
      }

      // setFile(null); // Clear file
    } catch (error) {
      message.error(error.data?.message || "Failed to edit meal.");
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
        <h1 className="font-semibold">Edit Meal</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Meal Item Editing
          </h3>
          <div className="w-full px-16">
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                  className="grid grid-cols-1 sm:grid-cols-2"
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
                        Meal Name
                      </span>
                    }
                    name="mealName"
                    className=""
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Meal Name"
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

                  {/* Meal Type */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Meal Type
                      </span>
                    }
                    name="mealTime"
                    className=""
                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                  >
                    <Select
                      placeholder="Select Type"
                      style={{
                        height: "40px",
                        fontWeight: 600,
                        border: "none", // Remove the custom border styling here
                        fontSize: "18px",
                        color: "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      dropdownStyle={{
                        border: "1px solid #79CDFF", // Custom border for dropdown if needed
                      }}
                    >
                      <Option value="Breakfast">Breakfast</Option>
                      <Option value="Lunch">Lunch</Option>
                      <Option value="Dinner">Dinner</Option>
                      <Option value="Snacks">Snacks</Option>
                    </Select>
                  </Form.Item>

                  {/*  category */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Category
                      </span>
                    }
                    name="category"
                    className=""
                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                  >
                    <Select
                      placeholder="Select Category"
                      style={{
                        height: "40px",
                        fontWeight: 600,
                        border: "none", // Remove the custom border styling here
                        fontSize: "18px",
                        color: "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      dropdownStyle={{
                        border: "1px solid #79CDFF", // Custom border for dropdown if needed
                      }}
                    >
                      <Option value="vegan">Vegan</Option>
                      <Option value="vegitarian">Vegitarian</Option>
                      <Option value="keto">Keto/Low Carb</Option>
                      <Option value="high-protein">High-Protein</Option>
                    </Select>
                  </Form.Item>

                  {/* Suitable for  */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Suitable For:
                      </span>
                    }
                    name="suitableFor"
                    className=""
                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                  >
                    <Select
                      mode="multiple"
                      size={"middle"}
                      placeholder="Please select"
                      // defaultValue={['Vegetarian']}
                      onChange={handleMultiSelectChange}
                      style={{
                        width: "100%",
                      }}
                      options={options}
                    />
                  </Form.Item>

                  {/* Amount */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Amount
                      </span>
                    }
                    name="amount"
                    className=""
                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                  >
                    <Input
                      type="number"
                      placeholder="Add Amount"
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
              </Space>

              {/* Section 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div>
                  <h1 className="text-[18px] font-semibold pb-3">
                    Nutritional Info
                  </h1>
                  <Space
                    size="large"
                    direction="horizontal"
                    className="responsive-space-section-2"
                  >
                    {/* Calories */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Calories
                        </span>
                      }
                      name="calories"
                      className="-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Add Calories"
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

                    {/* Carbs */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Carbs
                        </span>
                      }
                      name="carbs"
                      className="-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Add Carbs"
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

                    {/* Proteins */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Proteins
                        </span>
                      }
                      name="proteins"
                      className="-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Add Proteins"
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

                    {/* Fats */}
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#2D2D2D",
                          }}
                        >
                          Fats
                        </span>
                      }
                      name="fats"
                      className="-section-2"
                    >
                      <Input
                        type="number"
                        placeholder="Add Fats"
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

export default EditMeal;
