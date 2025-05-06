import React, { useState } from "react";
import { Button, DatePicker, Input, Table } from "antd";
import { FiAlertCircle } from "react-icons/fi";
import DashboardModal from "../../../Components/DashboardModal";
import { IoClose, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import exlamIcon from "../../../assets/images/exclamation-circle.png";
import { useGetAllUserQuery } from "../../../redux/features/auth/authApi";
import moment from "moment";
import mealImg from "../../../assets/images/meal.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const defaultImage =
  "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const { data: allUsers, isLoading } = useGetAllUserQuery(query);

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

  const columns = [
    {
      title: "Image",
      dataIndex: "userImage",
      key: "userImage",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Primary Goal",
      key: "primaryGoal",
      dataIndex: "primaryGoal",
    },
    {
      title: "Points",
      key: "points",
      dataIndex: "points",
    },
    {
      title: "Action",
      key: "Review",
      aligen: "center",
      render: (_, data) => (
        <div className="  items-center justify-around textcenter flex">
          {/* Review Icon */}
          <img
            src={exlamIcon}
            alt=""
            className="btn  px-3 py-1 text-sm rounded-full  cursor-pointer"
            onClick={() => showModal(data)}
          />
          {/* <Link to={'/reviews'} className="btn bg-black text-white px-3 py-1 text-sm rounded-full">
             
              View
            </Link> */}
        </div>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data =
    allUsers?.data?.map((user, index) => ({
      key: index,
      userImage: (
        <div className="flex items-center justify-center">
          <img
            src={user.image || "https://via.placeholder.com/40"} // Use placeholder if no image
            onError={(e) => (e.target.src = defaultImage)}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      ),
      userName: user.name
        ? `${user.name.firstName} ${user.name.lastName}`
        : "N/A",
      email: user.email,
      primaryGoal: user.primaryGoal || "N/A",
      points: user.appData?.points || 0,
      ...user,
    })) || [];

  return (
    <div className="rounded-lg border-2 py-4 border-[#37B5FF]/80 mt-8 recent-users-table">
      <div className="flex justify-between px-2">
        <h3 className="text-2xl text-black mb-4 pl-2">Users List</h3>
        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="User Name"
            className="w-48 placeholder:text-lightblue border border-lightBlue"
            style={{ border: "1px solid #37B5FF" }}
            value={searchTerm || ""}
            onChange={handleSearchChange}
          />
          {/* <Button style={{ border: 'none', backgroundColor: '#EBF8FF', color: '#174C6B', borderRadius: '8px' }}>
                   <IoSearch />
                 </Button> */}
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
            <p>
              {modalData.name
                ? `${modalData.name.firstName} ${modalData.name.lastName}`
                : "N/A"}
            </p>
          </div>
          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Email</p>
            <p>{modalData.email}</p>
          </div>
          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Gender</p>
            <p>{modalData.gender}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Date of birth</p>
            <p>{moment(modalData.dateOfBirth).format("MMM Do YYYY")}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Activity Level</p>
            <p>{modalData.activityLevel}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Height</p>
            <p>{modalData.height} cm</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Weight</p>
            <p>{modalData.weight} kg</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Diet</p>
            <p>{modalData.diet}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Injury</p>
            <p>{modalData.injury}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Medical Condition</p>
            <p>{modalData.medicalCondition}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Movement Difficulty</p>
            <p>{modalData.movementDifficulty}</p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Primary Goal</p>
            <p>{modalData.primaryGoal}</p>
          </div>

          <div className="p-4 mt-auto text-center mx-auto flex items-center justify-center">
            <button
              className="w-[300px] bg-[#174C6B] text-white px-10 h-[50px] flex items-center justify-center gap-3 text-lg outline-none rounded-xl"
              onClick={handleCancel}
            >
              <span className="text-white font-light">Okay</span>
            </button>
          </div>
        </div>
      </DashboardModal>
    </div>
  );
};

export default Users;
