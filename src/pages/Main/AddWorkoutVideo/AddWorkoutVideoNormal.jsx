import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { CiCamera } from "react-icons/ci";
import { IoVideocamOutline } from "react-icons/io5";
import { useCreateWorkoutVideoMutation } from "../../../redux/features/workoutVideo/workoutVideoApi";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { message } from "antd";

const AddWorkoutVideoNormal = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [createWorkoutVideo, { isLoading }] = useCreateWorkoutVideoMutation();
  const navigate = useNavigate();

  // FFmpeg states
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [videoResolution, setVideoResolution] = useState(null);
  const [needsConversion, setNeedsConversion] = useState(false);
  const [convertedVideo, setConvertedVideo] = useState(null);

  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

  // Load FFmpeg on component mount
  // useEffect(() => {
  //   loadFFmpeg();
  // }, []);

  // const loadFFmpeg = async () => {
  //   try {
  //     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  //     const ffmpeg = ffmpegRef.current;
  //     console.log(ffmpeg);

  //     ffmpeg.on("log", ({ message }) => {
  //       if (messageRef.current) {
  //         messageRef.current.innerHTML = message;
  //       }
  //       console.log(message);
  //     });

  //     ffmpeg.on("progress", ({ progress }) => {
  //       setConversionProgress(Math.round(progress * 100));
  //     });

  //     await ffmpeg.load({
  //       coreURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.js`,
  //         "text/javascript"
  //       ),
  //       wasmURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.wasm`,
  //         "application/wasm"
  //       ),
  //     });

  //     setFfmpegLoaded(true);
  //     console.log("FFmpeg loaded successfully");
  //   } catch (error) {
  //     console.error("Error loading FFmpeg:", error);
  //   }
  // };

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

  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("video/")) {
      alert("You can only upload video files!");
      return;
    }

    setVideoFile(file);
    setConvertedVideo(null);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("You can only upload image files!");
    }
  };

  const convertVideo = async () => {
    if (!ffmpegLoaded || !videoFile) {
      alert("FFmpeg is not loaded or no video selected");
      return;
    }

    try {
      setIsConverting(true);
      setConversionProgress(0);

      const ffmpeg = ffmpegRef.current;
      const inputFileName = "input_video" + getFileExtension(videoFile.name);
      console.log(ffmpeg, inputFileName);

      // Write the file to FFmpeg's virtual file system
      await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

      // Execute FFmpeg command to convert to 720p
      // -vf scale=-1:720 maintains aspect ratio while setting height to 720px
      await ffmpeg.exec([
        "-i",
        inputFileName,
        "-vf",
        "scale=-1:720",
        "-c:v",
        "libx264",
        "-crf",
        "23",
        "-preset",
        "ultrafast",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "output.mp4",
      ]);

      // Read the converted file
      const data = await ffmpeg.readFile("output.mp4");
      const convertedBlob = new Blob([data.buffer], { type: "video/mp4" });

      // Create a File object from the Blob
      const convertedFile = new File(
        [convertedBlob],
        videoFile.name.replace(getFileExtension(videoFile.name), ".mp4"),
        { type: "video/mp4" }
      );

      setConvertedVideo(convertedFile);
      // console.log("Video converted successfully");
    } catch (error) {
      console.error("Error converting video:", error);
      alert("Error converting video: " + error.message);
    } finally {
      setIsConverting(false);
    }
  };

  const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf("."));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if video needs conversion but hasn't been converted yet
    if (needsConversion && !convertedVideo) {
      alert("Please convert the video to 720p before submitting");
      return;
    }

    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Use the converted video if available, otherwise use the original
    const videoToUpload = convertedVideo || videoFile;
    if (videoToUpload) {
      formData.append("media", videoToUpload);
    }

    formData.append("data", JSON.stringify({ name: name }));

    try {
      //   console.log("Submitting form with video:", videoToUpload);
      const response = await createWorkoutVideo(formData).unwrap();
      //   console.log("Response from add video:", response);
      //   alert("Video added successfully!");

      if (response.success) {
        // Reset form
        navigate(-1);
        message.success(response.message || "Video addeded successfuly");
      }
    } catch (error) {
      alert(error.data?.message || "Failed to add video.");
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-xl cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaAngleLeft />
        <h1 className="font-semibold">Add Video</h1>
      </div>
      <div className="rounded-lg py-4 border-[#79CDFF] border-2 shadow-lg mt-8 bg-white">
        <div className="space-y-[24px] min-h-[70vh] bg-light-gray rounded-2xl">
          <h3 className="text-2xl text-[#174C6B] mb-4 border-b border-[#79CDFF]/50 pb-3 pl-16 font-semibold">
            Adding Video
          </h3>
          <div className="w-full px-16">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-44 mt-8">
                {/* select video */}
                <div className="mb-8 lg:mb-0">
                  <label className="block text-lg font-semibold text-[#2D2D2D] mb-[6px]">
                    Upload Video
                  </label>
                  <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center  px-2 py-3 rounded-md">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                      id="videoUpload"
                    />
                    <label
                      htmlFor="videoUpload"
                      className="cursor-pointer w-full flex justify-between items-center"
                    >
                      <span className="text-[#525252] font-semibold">
                        {videoFile ? videoFile.name : "Select a video"}
                      </span>
                      <IoVideocamOutline size={20} color="#174C6B" />
                    </label>
                  </div>

                  {/* Video Resolution Info */}
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

                  {/* Conversion Button */}
                  {/* {needsConversion && videoFile && !convertedVideo && !isConverting && (
                                        <button
                                            type="button"
                                            onClick={convertVideo}
                                            className="mt-3 bg-[#174C6B] text-white px-4 py-2 rounded-md"
                                            disabled={!ffmpegLoaded}
                                        >
                                            Convert to 720p
                                        </button>
                                    )} */}

                  {/* Conversion Status */}
                  {/* {isConverting && (
                                        <div className="mt-3">
                                            <p>Converting video... {conversionProgress}%</p>
                                            <div>
                                                <div class="relative">
                                                    <div class="w-full bg-[#d9d9d9] rounded-xl h-5 flex items-center justify-between px-2">
                                                        <div class="bg-[#174C6B] h-3 rounded-xl" style={{ width: `${conversionProgress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}

                  {/* Conversion Complete */}
                  {/* {convertedVideo && (
                                        <p className="mt-2 text-green-600">Video converted successfully! Ready to upload.</p>
                                    )} */}
                </div>

                {/* video thumbnail */}
                <div>
                  <label className="block text-lg font-semibold text-[#2D2D2D] mb-[6px]">
                    Upload Thumbnail
                  </label>
                  <div className="relative lg:w-[482px] w-full border border-[#79CDFF] flex justify-between items-center px-2 py-3 rounded-md">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer w-full flex justify-between items-center"
                    >
                      <span className="text-[#525252] font-semibold">
                        {imageFile ? imageFile.name : "Select an image"}
                      </span>
                      <CiCamera size={25} color="#174C6B" />
                    </label>
                  </div>
                </div>
              </div>

              {/* video title */}
              <div className="mt-8">
                <label className="block text-lg font-semibold text-[#2D2D2D] mb-[6px]">
                  Video Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter video title"
                  className="lg:w-[482px] w-full border border-[#79CDFF]  px-2 py-3 rounded-md text-lg font-semibold text-[#525252] placeholder:text-[#525252]"
                  required
                />
              </div>

              <div className="p-4 mt-10 text-center mx-auto flex items-center justify-center">
                <button
                  type="submit"
                  className="w-[500px] bg-[#174C6B] disabled:bg-[#174C6B]/50 disabled:cursor-not-allowed text-white px-10 h-[45px] flex items-center justify-center gap-3 text-lg outline-none rounded-md"
                  disabled={
                    !videoFile ||
                    (needsConversion && !convertedVideo) ||
                    isConverting ||
                    !name
                  }
                >
                  <span className="text-white font-semibold">
                    {isLoading ? <LoadingSpinner color="white" /> : "Upload"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddWorkoutVideoNormal;
