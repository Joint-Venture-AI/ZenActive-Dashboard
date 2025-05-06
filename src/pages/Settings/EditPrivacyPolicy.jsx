import { Button, message } from "antd";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useEditPrivacyMutation, useGetPrivacyQuery } from "../../redux/features/setting/settingApi";

// Import 'size' style attributor
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["14px", "16px", "18px"]; // Custom font sizes
Quill.register(Size, true);

const modules = {
  toolbar: {
    container: [
      [{ size: ["14px", "16px", "18px"] }], // Use whitelisted sizes
      [{ color: [] }], // Text color dropdown
      ["bold", "italic", "underline", 'strike'], // Formatting options
      [{ align: [] }],
      ["link"],
      // ["image", "link"],
      [{ list: 'bullet' }],
    ],
    handlers: {
      align: function (value) {
        this.quill.format('align', value);
      },
    },
  },
};

const formats = [
  "size", // Custom font sizes
  "color",
  "align",
  "bold",
  "italic",
  "underline",
  "link",
  // "image",
  "list",
];

const EditPrivacyPolicy = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { data: privacy, isLoading: isFetchingPrivacy } = useGetPrivacyQuery();
  const [editPrivacy, { isLoading }] = useEditPrivacyMutation();

  const handleBackButtonClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  // Set existing terms in the editor when data is fetched
  useEffect(() => {
    if (privacy?.data?.privacy) {
      setContent(privacy.data.privacy);
    }
  }, [privacy]); // Run when `terms` changes


  const handleUpdate = async () => {
    if (!content.trim()) {
      message.error("Privacy policy cannot be empty!");
      return;
    }

    try {
      await editPrivacy({ privacy: content }).unwrap(); // Call the mutation
      message.success("Privacy policy updated successfully!");
    } catch (error) {
      message.error("Failed to update Privacy policy.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 text-xl cursor-pointer" onClick={handleBackButtonClick}>
        <FaAngleLeft />
        <h1>Privacy & Policy</h1>
      </div>
      <div className="rounded-lg py-4 border-lightGray border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-black mb-4 border-b-2 border-lightGray/40 pb-3 pl-16">
            Privacy & Policy Edit
          </h3>
          <div className="w-full px-16">
            <div className="h-full border border-gray-400 rounded-md">
              <div className="ql-toolbar-container h-56">
                {/* <div id="toolbar">
                     <span className="ql-formats">
   
                       <button className="ql-align" value="left">
                         Left
                       </button>
                       <button className="ql-align" value="center">
                         Center
                       </button>
                       <button className="ql-align" value="right">
                         Right
                       </button>
                       <button className="ql-align" value="justify">
                         Justify
                       </button>
                     </span>
   
                   </div> */}
                <ReactQuill
                  placeholder="Enter your update terms & conditions..."
                  theme="snow"
                  value={content}
                  onChange={(value) => setContent(value)}
                  modules={modules}
                  formats={formats}
                  className="custom-quill-editor"
                />
              </div>
            </div>

          </div>
          <div className="flex justify-end pt-8 pr-16">
            <Button
              size="large"
              type="primary"
              onClick={handleUpdate}
              loading={isLoading}
              className="px-8 bg-[#174C6B] text-white hover:bg-black/90 rounded-xl font-semibold h-11 min-w-[300px]"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPrivacyPolicy;
