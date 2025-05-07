import React, { useState } from "react";
import { message, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import defaultBadge from "../../../assets/images/label.png";
import badgeImg from "../../../assets/images/badge-default.png";
import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  useDeleteBadgeMutation,
  useGetBadgesQuery,
} from "../../../redux/features/badge/badgeApi";
import { MdEdit } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const Store = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [query, setQuery] = useState(""); // State to trigger search
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const { data: badges, isLoading } = useGetBadgesQuery(query);
  const [deleteBadge] = useDeleteBadgeMutation();

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Trigger search when button is clicked
  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const handleDelete = async (badgeId) => {
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
          setDeleteId(badgeId);
          const res = await deleteBadge(badgeId).unwrap();

          if (res.success) {
            message.success("Badge deleted successfully!");
            setDeleteId(null);
          }
        } catch (error) {
          setDeleteId(null);
          message.error(error.data?.message || "Failed to delete badge.");
        }
      }
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image", // This should match the original key in the data object
      key: "image",
      render: (image) => (
        <div className="flex items-center justify-center">
          <img
            src={import.meta.env.VITE_BASE_URL_IMAGE + image}
            onError={(e) => (e.target.src = defaultBadge)}
            alt="badge"
            className="w- h-10 rounded-full object-contain"
          />
        </div>
      ),
    },
    {
      title: "Badge Name",
      dataIndex: "badgeName",
      key: "badgeName",
    },
    {
      title: "Points to Achieve",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Action",
      key: "Review",
      aligen: "center",
      render: (_, data) => (
        <div className=" items-center justify-center gap-4 text-center flex">
          {/* Review Icon */}

          <Link to={`edit-badge/${data._id}`} className="">
            <MdEdit />
          </Link>
          <button
            type="button"
            className=" "
            onClick={() => handleDelete(data?._id)}
          >
            <span className="text-[#1E648C] font-semibold">
              {data?._id === deleteId ? (
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

  // const showModal = (data) => {
  //   setIsModalOpen(true);
  //   setModalData(data);
  // };

  // const items = [
  //   {
  //     label: (
  //       <a
  //         href="https://www.antgroup.com"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         1st menu item
  //       </a>
  //     ),
  //     key: "0",
  //   },
  //   {
  //     label: (
  //       <a
  //         href="https://www.aliyun.com"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         2nd menu item
  //       </a>
  //     ),
  //     key: "1",
  //   },
  //   {
  //     type: "divider",
  //   },
  //   {
  //     label: "3rd menu item",
  //     key: "3",
  //   },
  // ];

  const data =
    badges?.data?.map((badge, index) => ({
      key: index,
      image: badge.image,
      badgeName: badge.name,
      points: badge.points,
      ...badge,
    })) || [];

  return (
    <div>
      <button
        className="px-6 py-2 min-w-[100px] text-center text-white bg-[#174C6B] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring float-end flex items-center gap-2"
        onClick={() => navigate("add-badge")}
      >
        <FaPlus />
        Add Badge
      </button>
      <div className="py-10">
        <div className="rounded-lg border-2 py-4 border-[#37B5FF]/80 mt-8 recent-users-table">
          <div className="flex justify-between px-2">
            <h3 className="text-2xl font-semibold text-black mb-4 pl-2">
              Badges List
            </h3>
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
          {/* <DashboardModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            maxWidth="500px"
          >
            <div>
              <h2 className="text-lg text-center mb-4">User Details</h2>
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
          </DashboardModal> */}
        </div>
      </div>
    </div>
  );
};

export default Store;
