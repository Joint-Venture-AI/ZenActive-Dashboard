import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import Quill from "quill";
import { useEditAboutMutation, useGetAboutQuery } from "../../redux/features/setting/settingApi";

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
    "list",
];
const EditTrust = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const { data: about, isLoading: isFetchingAbout } = useGetAboutQuery();
    const [editAbout, { isLoading }] = useEditAboutMutation();

    const handleBackButtonClick = () => {
        navigate(-1); // This takes the user back to the previous page
    };

    // Set existing terms in the editor when data is fetched
    useEffect(() => {
        if (about?.data?.about) {
            setContent(about.data.about);
        }
    }, [about]); // Run when `terms` changes


    const handleUpdate = async () => {
        if (!content.trim()) {
            message.error("About cannot be empty!");
            return;
        }

        try {
            await editAbout({ about: content }).unwrap(); // Call the mutation
            message.success("About updated successfully!");
        } catch (error) {
            message.error("Failed to update About.");
        }
    };

    return (
        <>
            <div className="flex items-center gap-2 text-xl cursor-pointer" onClick={handleBackButtonClick}>
                <FaAngleLeft />
                <h1>About us </h1>
            </div>
            <div className="rounded-lg py-4 border-lightGray border-2 shadow-lg mt-8 bg-white">
                <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
                    <h3 className="text-2xl text-black mb-4 border-b-2 border-lightGray/40 pb-3 pl-16">
                        About us Edit
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
                            className="px-8 h-12 bg-[#174C6B] text-white hover:bg-black/90 rounded-full font-semibold w-1/4"
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default EditTrust;
