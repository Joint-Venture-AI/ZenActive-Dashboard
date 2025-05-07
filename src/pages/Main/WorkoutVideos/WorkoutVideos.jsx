import React, { useState } from "react";
import { message, Table } from "antd";
import DashboardModal from "../../../Components/DashboardModal";
import { Link, useNavigate } from "react-router-dom";
import defaultThumb from "../../../assets/images/exclamation-circle.png";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import {
  useDeleteWorkoutVideoMutation,
  useGetWorkoutVideosQuery,
} from "../../../redux/features/workoutVideo/workoutVideoApi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import Swal from "sweetalert2";
import ReactPlayer from 'react-player'
const WorkoutVideos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [query, setQuery] = useState(""); // State to trigger search
  const navigate = useNavigate();
  const { data: workoutVideos, isLoading } = useGetWorkoutVideosQuery(query);
  const [deleteWorkoutVideo, { isLoading: deleteLoading }] =
    useDeleteWorkoutVideoMutation();

  const showModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Trigger search when button is clicked
  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const handleDelete = async (workoutId) => {
    Swal.fire({
      text: "Are you sure you want to delete this meal? ",
      showCancelButton: true,
      confirmButtonText: "     Sure    ",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      confirmButtonColor: "#174C6B",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
        actions: "swal-actions-container",
        popup: "swal-popup",
      },
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          setDeleteId(workoutId);
          // Call your delete API
          const res = await deleteWorkoutVideo(workoutId).unwrap();
          if (res.success) {
            message.success("Video deleted successfully!");
            setDeleteId(null);
          }
        } catch (error) {
          setDeleteId(null);
          message.error(error.data?.message || "Failed to delete video.");
        }
      }
    });
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "video", // This should match the original key in the data object
      key: "video",
      render: (video) => (
        <div className="flex items-center justify-center">
  
<ReactPlayer width={180} height={100} controls={true} url={video} />
        
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      key: "Review",
      aligen: "center",
      render: (_, data) => (
        <div className="items-center justify-center gap-3 text-center flex">
          {/* Review Icon */}

          <Link to={`edit-workout-video/${data._id}`} className="">
            <MdEdit />
          </Link>
          <button
            type="button"
            className=""
            onClick={() => handleDelete(data?._id)}
          >
            <span className="text-[#1E648C] font-semibold">
              {deleteId === data?._id ? (
                <LoadingSpinner color="#436F88" />
              ) : (
                <FaTrash />
              )}
            </span>
          </button>
        </div>
      ),
    },
  ];

  const data =
    workoutVideos?.data?.map((workoutVideo, index) => ({
      key: index,
      thumbnail: workoutVideo.image,
      title: workoutVideo.name,
      ...workoutVideo,
    })) || [];

  return (
    <div>
      <button
        className="px-6 py-2 min-w-[100px] text-center text-white bg-[#174C6B] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring float-end flex items-center gap-2"
        onClick={() => navigate("add-workout-video")}
      >
        <FaPlus />
        Add Video
      </button>
      <div className="py-10">
        <div className="rounded-lg border-2 py-4 border-[#37B5FF]/80 mt-8 recent-users-table">
          <div className="flex justify-between px-2">
            <h3 className="text-2xl font-semibold text-black mb-4 pl-2">
              Workout Videos
            </h3>
            {/* <div className="flex items-center gap-4 mb-6">
              <Input
                placeholder="Search badges by name"
                className="w-48 placeholder:text-[#174C6B]"
                style={{ border: "1px solid #79CDFF" }}
                value={searchTerm || ""}
                onChange={handleSearchChange}
              />
              <button
                style={{
                  border: "none",
                  backgroundColor: "#caf0f8",
                  color: "#174C6B",
                  borderRadius: "50%",
                  padding: "7px",
                }}
                onClick={handleSearch}
              >
                <IoSearch size={20} />
              </button>
            </div> */}
          </div>
          {/* Ant Design Table */}
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={{
              position: ["bottomCenter"],
              itemRender: (current, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <button className="custom-pagination flex items-center gap-2 border border-[#79CDFF] rounded-md px-2 text-darkBlue">
                      <IoIosArrowBack className="" />
                      Back
                    </button>
                  );
                }
                if (type === "next") {
                  return (
                    <button className="custom-pagination flex items-center gap-2 border border-darkBlue bg-darkBlue rounded-md px-2 text-white">
                      Next
                      <IoIosArrowForward />
                    </button>
                  );
                }
                return originalElement;
              },
            }}
            className="rounded-lg"
          />

          {/* Dashboard Modal */}
          <DashboardModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            maxWidth="500px"
          >
            <div>
              <h2 className="text-lg text-center mb-4">User Details</h2>
              {/* <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>#SL</p>
              <p>{modalData.transIs}</p>
            </div> */}
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>User Name</p>
                <p>{modalData.name}</p>
              </div>
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Email</p>
                <p>{modalData.Email}</p>
              </div>
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Mobile Phone</p>
                <p>{modalData.Phone}</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Date</p>
                <p>{modalData.transIs}</p>
              </div>

              <div className="p-4 mt-auto text-center mx-auto flex items-center justify-center">
                <button className="w-[300px] bg-[#174C6B] text-white px-10 h-[50px] flex items-center justify-center gap-3 text-lg outline-none rounded-xl">
                  <span className="text-white font-light">Okay</span>
                </button>
              </div>
            </div>
          </DashboardModal>
        </div>
      </div>
    </div>
  );
};

export default WorkoutVideos;
