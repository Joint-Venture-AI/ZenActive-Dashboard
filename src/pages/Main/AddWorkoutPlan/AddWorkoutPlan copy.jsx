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
import {
  useCreateWorkoutPlanMutation,
  useGetWorkoutPlansQuery,
} from "../../../redux/features/workoutPlans/workoutPlansApi";

const AddWorkoutPlan = () => {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [week, setWeek] = useState(1);
  const [name, setName] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: workoutPlans } = useGetWorkoutPlansQuery(null);
  const [createWorkoutPlan, { isLoading }] = useCreateWorkoutPlanMutation();

  // Handle file selection
  const handleFileChange = ({ file }) => {
    setFile(file.originFileObj); // Save selected file
  };

  const workoutsArray = workoutPlans?.data?.map(
    (workoutPlan) => workoutPlan.workouts
  );
  const flattenedWorkouts = workoutsArray?.flat(); // Flattening the array of arrays
  const workoutsId = flattenedWorkouts?.map((w) => w._id);

  // Logic for multi select input
  const options =
    workoutPlans?.data?.reduce((acc, workoutPlan) => {
      workoutPlan.workouts.forEach((workout) => {
        if (!acc.some((item) => item.value === workout._id)) {
          acc.push({ value: workout._id, label: workout.name });
        }
      });
      return acc;
    }, []) || [];

  const handleMultiSelectChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  function extractJsonData(jsonString) {
    try {
      // Use regex to match the content inside the first pair of curly braces
      const match = jsonString.match(/{.*}/s);

      if (match) {
        // Parse and return the matched part as a JSON object
        return JSON.parse(match[0]);
      } else {
        // If no match, return null or handle accordingly
        return null;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  const onFinish = async (values) => {
    const formattedData = {
      ...values,
      points: Number(values.points),
      duration: Number(values.duration),
    };
    const duration = Number(values.duration); // Convert string to number
    const expectedWorkouts = duration * 7; // 8 weeks = 56 workouts, 12 weeks = 84 workouts

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }
      formData.append("data", JSON.stringify(formattedData));

      const createResponse = await createWorkoutPlan(formData).unwrap();
      // console.log(createResponse, "Workout plan created successfully!");
      message.success("Workout plan created successfully!");
      form.resetFields();
      setFile(null);
      // const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Replace with your actual API key
      // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      // const response = await fetch(url, {
      //     method: "POST",
      //     headers: {
      //         "Content-Type": "application/json",
      //     },
      //     // body: JSON.stringify({
      //     //     contents: [
      //     //         {
      //     //             parts: [
      //     //                 {
      //     //                     text: `${JSON.stringify(
      //     //                         values.description
      //     //                     )} this is my workout data.  make workout plan for ${values.duration} week. workout plan name is ${values.name}. ensure each day have 1 workout. make plan based on the workout plan name. workout can be repeted. give me just json data based on this mongoose schema :
      //     //                     [ const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
      //     //                     {
      //     //                       name: { type: String, required: true },
      //     //                       description: { type: String, required: true },
      //     //                     duration: { type: Number, required: true },
      //     //                       workouts: [{ type: Schema.Types.ObjectId, required: true, ref: "Workout" }],
      //     //                       points: { type: Number, required: true },
      //     //                       isDeleted: { type: Boolean, default: false },
      //     //                       image: { type: String, required: true },
      //     //                     },
      //     //                     { timestamps: true }
      //     //                         )]
      //     //                     ;

      //     //                       `,
      //     //                 },
      //     //             ],
      //     //         }
      //     //     ]
      //     // }),
      //     body: JSON.stringify({
      //         contents: [{
      //             parts: [{
      //                 text: `
      //                 ${JSON.stringify(values.description)} this is my workout data.
      //                 Make a structured workout plan for ${duration} weeks.
      //                 Workout plan name: ${values.name}. Points will be ${values.points} in number format.

      //                 STRICT REQUIREMENT:
      //                 - If the duration is **8 weeks, you MUST return exactly 56 workouts (8 * 7)**.
      //                 - If the duration is **12 weeks, you MUST return exactly 84 workouts (12 * 7)**.
      //                 - DO NOT generate more or fewer workouts than the required number **${values.duration * 7}**.
      //                 - DO NOT include extra workouts beyond ${values.duration * 7}.

      //                 **ONLY** select workouts from this list: ${JSON.stringify(workoutsId)}.
      //                 **DO NOT** return null values in the workouts array.
      //                 **DO NOT** generate new workout IDs, only use IDs from the given list.
      //                .

      //                 Provide only JSON data based exactly on this Mongoose schema:
      //                 [
      //                     const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
      //                         name: { type: String, required: true },
      //                         description: { type: String, required: true },
      //                         about: { type: String, required: true },
      //                         duration: { type: Number, required: true },
      //                         workouts: [{ type: Schema.Types.ObjectId, required: true, ref: "Workout" }],
      //                         points: { type: Number, required: true },
      //                         isDeleted: { type: Boolean, default: false },
      //                         image: { type: String, required: true }
      //                     }, { timestamps: true })
      //                 ]`

      //             }]
      //         }]
      //     }),
      // });

      // const data = await response.json();
      // const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      // console.log("API Response:", responseText);

      // const parsedData = extractJsonData(responseText);

      // console.log(parsedData, 'parsedData');

      // if (parsedData) {
      //     // Ensure the number of workouts matches the required 7 days * X weeks
      //     // const expectedWorkouts = parsedData.duration * 7;

      //     // if (parsedData.workouts.length !== expectedWorkouts) {
      //     //     console.error(`Mismatch: ${parsedData.workouts.length} workouts for ${parsedData.duration} weeks (expected ${expectedWorkouts})`);
      //     //     message.error(`Error: Expected ${expectedWorkouts} workouts, but received ${parsedData.workouts.length}`);
      //     //     return;
      //     // }
      //     // const formattedData = {
      //     //     name: parsedData.name,
      //     //     description: parsedData.description,
      //     //     about: parsedData.about,
      //     //     duration: parsedData.duration,
      //     //     points: parsedData.points > 0 ? parsedData.points : 0, // Ensure points are positive
      //     //     workouts: parsedData.workouts.filter(workout => workout && typeof workout === "string"), // Remove null values
      //     //     image: parsedData.image,
      //     // };

      //     // if (formattedData.workouts.length === 0) {
      //     //     message.error("No valid workouts returned from Gemini.");
      //     //     return;
      //     // }

      //     const formData = new FormData();
      //     if (file) {
      //         formData.append("image", file);
      //     }
      //     formData.append("data", JSON.stringify(formattedData));

      //     const createResponse = await createWorkoutPlan(formData).unwrap();
      //     console.log(createResponse, 'Workout plan created successfully!');
      //     message.success("Workout plan created successfully!");
      //     form.resetFields();
      //     setFile(null);
      // } else {
      //     message.error("Failed to process workout plan.");
      // }

      // if (parsedData) {
      //     setWorkoutPlan(parsedData);
      // }

      // setMessages((prevMessages) => [
      //     ...prevMessages,
      //     {
      //         sender: "Gemini",
      //         text: responseText,
      //     },
      // ]);
    } catch (err) {
      setError("Failed to fetch response from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
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
        <h1 className="font-semibold">Add Workout Plan</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Workout Plan
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
                        Plan Name
                      </span>
                    }
                    name="name"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan Name"
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
                        Plan Description
                      </span>
                    }
                    name="description"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan Description"
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

                  {/* About */}
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2D2D2D",
                        }}
                      >
                        Plan About
                      </span>
                    }
                    name="about"
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Plan Description"
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
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please enter the package amount!' }]}
                  >
                    <Upload {...props} onChange={handleFileChange} maxCount={1}>
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
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
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
                    className="responsive-form-item"
                    // rules={[{ required: true, message: 'Please select a package name!' }]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Duration"
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

                  {/* <Form.Item
                                        label={<span style={{ fontSize: '18px', fontWeight: '600', color: '#2D2D2D' }}>Select Duration</span>}
                                        name="duration"
                                        className="responsive-form-item"
                                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                                    >
                                        <Select placeholder="Select Duration"
                                            style={{
                                                height: '40px',
                                                fontWeight: 600,
                                                border: 'none', // Remove the custom border styling here
                                                fontSize: '18px',
                                                color: '#525252',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                            dropdownStyle={{
                                                border: '1px solid #79CDFF', // Custom border for dropdown if needed
                                            }}
                                        >
                                            <Option value="8">8</Option>
                                            <Option value="12">12</Option>

                                        </Select>
                                    </Form.Item> */}

                  {/* Workouts */}
                  {/* <Form.Item
                                        label={<span style={{ fontSize: '18px', fontWeight: '600', color: '#2D2D2D' }}>Select Workout</span>}
                                        name="workouts"
                                        className="responsive-form-item"
                                    // rules={[{ required: true, message: 'Please select a duration!' }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            size={'middle'}
                                            placeholder="Select Workout"
                                            // defaultValue={['Vegetarian']}
                                            onChange={handleMultiSelectChange}
                                            style={{
                                                width: '100%',
                                            }}
                                            options={options}
                                        />
                                    </Form.Item> */}
                </Space>
              </Space>

              {/* Submit Button */}
              <Form.Item>
                <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                  <button className="w-[500px] bg-[#174C6B] text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md ">
                    <span className="text-white font-semibold">
                      {isLoading ? "Creating" : "Create"}
                    </span>
                  </button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Form for AI */}
        {/* <div className="flex flex-col">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Enter workout details"
                        className="border p-2 mr-2"
                    />
                    <input
                        type="number"
                        value={week}
                        onChange={(e) => setWeek(Number(e.target.value))}
                        placeholder="Number of weeks"
                        className="border p-2 mr-2"
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Workout plan name"
                        className="border p-2 mr-2"
                    />
                    <button
                        className="bg-blue-400 text-white px-4 py-2 rounded"
                        onClick={handleSendMessage}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Send"}
                    </button>

                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    {workoutPlan && (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold">Generated Workout Plan</h2>
                            <table className="table-auto border-collapse border border-gray-400 mt-2 w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 px-4 py-2">Name</th>
                                        <th className="border border-gray-400 px-4 py-2">Description</th>
                                        <th className="border border-gray-400 px-4 py-2">Duration</th>
                                        <th className="border border-gray-400 px-4 py-2">Workouts</th>
                                        <th className="border border-gray-400 px-4 py-2">Points</th>
                                        <th className="border border-gray-400 px-4 py-2">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-400 px-4 py-2">{workoutPlan.name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{workoutPlan.description}</td>
                                        <td className="border border-gray-400 px-4 py-2">{workoutPlan.duration} days</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {workoutPlan.workouts.map((workout, index) => (
                                                <span key={index} className="block">{workout._id}</span>
                                            ))}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">{workoutPlan.points}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <img src={workoutPlan.image} alt="Workout Plan" className="w-20 h-20" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div> */}
      </div>
    </>
  );
};

export default AddWorkoutPlan;
