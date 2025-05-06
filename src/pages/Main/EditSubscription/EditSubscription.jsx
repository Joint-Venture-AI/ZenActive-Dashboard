import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
import { FaAngleLeft } from "react-icons/fa6";

const EditSubscription = () => {
  const [form] = Form.useForm();
  const [features, setFeatures] = useState([""]);

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const onFinish = (values) => {
    // console.log('Form Values:', values);
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
        <h1>Edit Subscription</h1>
      </div>
      <div className="rounded-lg py-4 border-lightGray border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b-2 border-[#174C6B]/50 pb-3 pl-16">
            Subscription Package Editing
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
                  borderBottom: "2px solid rgb(52 92 140 / 0.5)",
                }}
              >
                <Space
                  size="large"
                  direction="horizontal"
                  className="responsive-space"
                >
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Package Name
                      </span>
                    }
                    name="packageName"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Select
                      placeholder="Select Package"
                      style={{ height: "40px" }}
                    >
                      <Option value="basic">Basic</Option>
                      <Option value="premium">Premium</Option>
                      <Option value="enterprise">Enterprise</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Package Amount
                      </span>
                    }
                    name="packageAmount"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please enter the package amount!' }]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Amount"
                      style={{ height: "40px" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Package Duration
                      </span>
                    }
                    name="packageDuration"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                  >
                    <Select
                      placeholder="Select Duration"
                      style={{ height: "40px" }}
                    >
                      <Option value="1_month">1 Month</Option>
                      <Option value="3_months">3 Months</Option>
                      <Option value="1_year">1 Year</Option>
                    </Select>
                  </Form.Item>
                </Space>
              </Space>

              {/* Section 2 */}
              <Form.Item>
                <h1 className="text-xl py-5">Package Features</h1>
                {/* <Space direction="horizontal" style={{ width: '100%', justifyContent: 'start', alignItems: 'center' }}> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {features.map((feature, index) => (
                      <Space
                        key={index}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Input
                          placeholder="Add New Feature"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...features];
                            newFeatures[index] = e.target.value;
                            setFeatures(newFeatures);
                          }}
                          style={{
                            width: "1320px",
                            height: "40px",
                            border: "1px solid #174C6B",
                          }}
                        />
                        {features.length > 1 && (
                          <Button
                            style={{
                              color: "#174C6B",
                              borderRadius: "50%",
                              padding: "10px",
                              height: "40px",
                              width: "40px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MinusOutlined
                              onClick={() => removeFeature(index)}
                            />
                          </Button>
                        )}
                      </Space>
                    ))}
                  </div>
                  <Button
                    type=""
                    // style={{ color: '#174C6B', borderRadius: '50%', padding: '10px', height: '40px', width: '40px' }}
                    style={{
                      color: "#174C6B",
                      borderRadius: "50%",
                      padding: "10px",
                      height: "40px",
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={addFeature}
                    block
                  >
                    <PlusOutlined />
                  </Button>
                </div>
                {/* </Space> */}
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-auto text-center mx-auto flex items-center justify-center">
                  <button className="w-[500px] bg-[#174C6B] text-white px-10 h-[40px] flex items-center justify-center gap-3 text-lg outline-none rounded-xl">
                    <span className="text-white font-light">Update</span>
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

export default EditSubscription;
