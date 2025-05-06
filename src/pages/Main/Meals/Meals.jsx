import React, { useState } from "react";
import { Input, message, Table } from "antd";
import DashboardModal from "../../../Components/DashboardModal";
import { IoClose, IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import mealImg from "../../../assets/images/meal.png";
import { FaPlus } from "react-icons/fa6";
import {
  useDeleteMealMutation,
  useGetAllMealQuery,
} from "../../../redux/features/meal/mealApi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import Swal from "sweetalert2";

const Meals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [query, setQuery] = useState(""); // State to trigger search
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const { data: meals, isLoading } = useGetAllMealQuery(query);
  const [deleteMeal] = useDeleteMealMutation();

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

  const handleDelete = async (mealId) => {
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
          // Call your delete API
          setDeleteId(mealId);
          const response = await deleteMeal(mealId).unwrap();
          if (response.success) {
            message.success("Meal deleted successfully!");
            setDeleteId(null);
          }
        } catch (error) {
          setDeleteId(null);
          console.log(error);
          message.error(error.data?.message || "Failed to delete meal.");
        }
      }
    });
  };

  const columns = [
    {
      title: "Meal Image",
      dataIndex: "mealImage",
      key: "mealImage",
      render: (image) => (
        <div className="flex items-center justify-center">
          <img
            src={import.meta.env.VITE_BASE_URL + image}
            onError={(e) => (e.target.src = mealImg)}
            alt="badge"
            className="size-12 rounded-md object-fill"
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "mealName",
      key: "mealName",
      render: (name, data) => {
        return (
          <button
            className="text-lg hover:text-blue-400 underline"
            onClick={() => showModal(data)}
          >
            {name}
          </button>
        );
      },
    },
    {
      title: "Meal Type",
      dataIndex: "mealType",
      key: "mealType",
    },
    {
      title: "Diet Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Calories",
      key: "calories",
      dataIndex: "calories",
    },
    {
      title: "Carbs",
      key: "carbs",
      dataIndex: "carbs",
    },
    {
      title: "Protiens",
      key: "protiens",
      dataIndex: "protiens",
    },
    {
      title: "Fats",
      key: "fats",
      dataIndex: "fats",
    },
    {
      title: "Action",
      key: "Review",
      aligen: "center",
      render: (_, data) => (
        <div className=" items-center justify-center gap-4 textcenter flex">
          {/* Review Icon */}
          <Link to={`edit-meal/${data._id}`} className="">
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data =
    meals?.data?.map((meal, index) => ({
      key: index,
      mealImage: meal.image,
      mealName: meal.mealName,
      mealType: meal.mealTime,
      category: meal.category,
      calories: meal.nutritionalInfo.calories,
      carbs: meal.nutritionalInfo.carbs,
      protiens: meal.nutritionalInfo.proteins,
      fats: meal.nutritionalInfo.fats,
      ...meal,
    })) || [];

  return (
    <div>
      <button
        className="px-6 py-2 min-w-[100px] text-center text-white bg-[#174C6B] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring float-end flex items-center gap-2"
        onClick={() => navigate("add-meal")}
      >
        <FaPlus />
        Add New Meal
      </button>
      <div className="py-10">
        <div className="rounded-lg border-2 py-4 border-[#37B5FF]/80 mt-8 recent-users-table">
          <div className="flex justify-between px-2">
            <h3 className="text-2xl text-black mb-4 pl-2">Meal List</h3>
            <div className="flex items-center gap-4 mb-6">
              <Input
                placeholder="Search meals by name..."
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
              {searchTerm && (
                <button
                  style={{
                    border: "none",
                    backgroundColor: "#caf0f8",
                    color: "#174C6B",
                    borderRadius: "50%",
                    padding: "7px",
                  }}
                  onClick={() => {
                    setSearchTerm(null);
                    setQuery(null);
                  }}
                >
                  <IoClose size={20} />
                </button>
              )}
            </div>
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
            className="rounded-lg overflow-x-auto"
          />

          {/* Dashboard Modal */}
          <DashboardModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            maxWidth="500px"
          >
            <div>
              <h2 className="text-lg text-center mb-4">Meal Details</h2>
              {/* <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>#SL</p>
              <p>{modalData.transIs}</p>
            </div> */}
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Meal Name</p>
                <p>{modalData?.mealName}</p>
              </div>
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Meal Type</p>
                <p>{modalData?.mealTime}</p>
              </div>
              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Diet Category</p>
                <p>{modalData?.category}</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Calories</p>
                <p>{modalData?.nutritionalInfo?.calories}g</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Carbs</p>
                <p>{modalData?.nutritionalInfo?.carbs}g</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Protiens</p>
                <p>{modalData?.nutritionalInfo?.proteins}g</p>
              </div>

              <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
                <p>Fats</p>
                <p>{modalData?.nutritionalInfo?.fats}g</p>
              </div>

              <div
                className="p-4 mt-auto text-center mx-auto flex items-center justify-center"
                onClick={handleCancel}
              >
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

export default Meals;
