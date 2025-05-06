import React, { useState } from "react";
import { Button, DatePicker, Input, Table } from "antd";
import { FiAlertCircle } from "react-icons/fi";
import DashboardModal from "../../../Components/DashboardModal";
import { IoClose, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import exlamIcon from "../../../assets/images/exclamation-circle.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  useGetRecentTransactionsQuery,
  useGetTotalEarningsQuery,
} from "../../../redux/features/transaction/transactionApi";
import moment from "moment";
import DownloadButton from "../../../Components/React-PDF/DownloadButton";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetAllUserQuery } from "../../../redux/features/auth/authApi";

const Earnings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [purchaseDate, setPurchaseDate] = useState(""); // State to store search input
  const [query, setQuery] = useState({ searchTerm: "", purchaseDate: "" });
  // State to trigger search
  const { data: recentTransactions, isLoading } =
    useGetRecentTransactionsQuery(query);
  const { data: totalEarnings, isLoading: earnLoading } =
    useGetTotalEarningsQuery();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUserQuery(query);

  const showModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // console.log(searchTerm);
  };

  // Handle date input change
  const handleDateChange = (date, dateString) => {
    setPurchaseDate(dateString); // Use the formatted date string
    // console.log(dateString);
  };

  // Trigger search when button is clicked
  const handleSearch = () => {
    setQuery({
      searchTerm,
      purchaseDate,
    });
  };

  const columns = [
    {
      title: "#Tr.ID",
      dataIndex: "transIs",
      key: "transIs",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
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

  // Map API response to table data
  const data =
    recentTransactions?.data?.map((transaction, index) => ({
      key: index,
      transIs: transaction.purchaseId,
      name: transaction.userId.name.firstName,
      subscription: transaction.packageName,
      amount: `$${transaction.packagePrice}`,
      date: moment(transaction.purchaseDate).format("DD MMM YYYY"),
      ...transaction,
    })) || [];

  return (
    <div>
      {/* Stats */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-6 px-[24px] bg-[#174C6B] border border-black  py-[20px] rounded-lg space-y-3  w-80">
          <div className="">
            <h3 className="text-[20px] text-white">{"Total Earnings"}</h3>
            <h3 className="text-[30px] text-white font-extralight">
              $
              {earnLoading ? (
                <LoadingSpinner color="white" size={15} />
              ) : (
                totalEarnings?.data?.totalEarn || 0
              )}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6 border border-lightBlue px-[24px] py-[20px] rounded-lg space-y-3 bg-white w-80 text-[#174C6B]">
          <div className="">
            <h3 className="text-[20px] text-gray font-semibold">
              {"Total Users"}
            </h3>
            <h3 className="text-[30px] font-extralight text-[#2683EB]">
              {usersLoading ? <LoadingSpinner /> : allUsers?.meta?.total || 0}
            </h3>
          </div>
        </div>
      </div>
      <div className="rounded-lg border-2 py-4 border-[#37B5FF]/80 mt-8 recent-users-table">
        <div className="flex justify-between px-2">
          <h3 className="text-2xl text-black mb-4 pl-2">Earnings</h3>
          <div className="flex items-center gap-4 mb-6">
            <DatePicker
              placeholder="Date"
              className="w-48 border-lightBlue"
              value={purchaseDate ? moment(purchaseDate) : null}
              onChange={handleDateChange}
            />

            <Input
              placeholder="Search..."
              className="w-48 placeholder:text-lightblue border border-lightBlue"
              style={{ border: "1px solid #37B5FF" }}
              value={searchTerm || ""}
              onChange={handleSearchChange}
            />

            <button
              style={{
                border: "none",
                backgroundColor: "#EBF8FF",
                color: "#174C6B",
                borderRadius: "50%",
                padding: "6px",
              }}
              onClick={handleSearch}
            >
              <IoSearch size={18} />
            </button>
            {(searchTerm || purchaseDate) && (
              <button
                style={{
                  border: "none",
                  backgroundColor: "#caf0f8",
                  color: "#174C6B",
                  borderRadius: "50%",
                  padding: "7px",
                }}
                onClick={() => {
                  setSearchTerm("");
                  setQuery({});
                  setPurchaseDate("");
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
          maxWidth="900px"
          backgroundColor="bg-[#EDEAF3]"
        >
          <div className="">
            <h2 className="text-lg text-center mb-4">Transaction Details</h2>
            <div className="flex justify-between mb-6 text-gray-600 border-b border-[#79CDFF] pb-1">
              <p>Transaction ID :</p>
              <p>{modalData.transIs}</p>
            </div>
            <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>Date :</p>
              <p>{moment(modalData.purchaseDate).format("DD MM YYYY")}</p>
            </div>
            <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>User Name :</p>
              <p>{modalData?.userId?.name.firstName}</p>
            </div>
            <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>Package Name :</p>
              <p>{modalData.packageName}</p>
            </div>
            <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
              <p>Package Price:</p>
              <p>${modalData.packagePrice}</p>
            </div>
            {/* <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Mobile Phone :</p>
            <p>{modalData.Phone}</p>
          </div> */}
            {/* <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>A/C number :</p>
            <p>{modalData.transIs}</p>
          </div>
          <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>A/C holder name :</p>
            <p>{modalData.transIs}</p>
          </div>
          <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Transaction amount</p>
            <p>{modalData.transIs}</p>
          </div>
          <div className="flex justify-between mb-6 text-gray-600  border-b border-[#79CDFF] pb-1">
            <p>Service</p>
            <p>{modalData.transIs}</p>
          </div> */}

            <div className="p-4 mt-auto text-center mx-auto flex items-center justify-center">
              <DownloadButton modalData={modalData} />
            </div>
          </div>
        </DashboardModal>
      </div>
    </div>
  );
};

export default Earnings;
