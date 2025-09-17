import { Table } from "antd";
import { Link } from "react-router-dom";
import exlamIcon from "../assets/images/exclamation-circle.png";
import DashboardModal from "./DashboardModal";
import { useState } from "react";
import { useGetRecentTransactionsQuery } from "../redux/features/transaction/transactionApi";
import moment from "moment";
import DownloadButton from "./React-PDF/DownloadButton";

const DashboardHomeTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [query, setQuery] = useState({ searchTerm: "", purchaseDate: "" });
  const { data: recentTransactions, isLoading } =
    useGetRecentTransactionsQuery(query);

  const showModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
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
      transIs:   transaction?.originalTransactionId ||transaction?.
purchaseToken 
,
      name: transaction.userId.name?.firstName,
      subscription: transaction?.productId,
      amount: `$${transaction?.price}`,
      date: moment(transaction.purchaseDate).format("DD MMM YYYY"),
      ...transaction,
    })) || [];

  return (
    <div className="rounded-lg border-2 py-4 border-[#37B5FF] mt-8 recent-users-table">
      <h3 className="text-2xl text-black mb-4 pl-2">Recent Transactions</h3>
      {/* Ant Design Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ position: ["bottomCenter"] }}
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
  );
};

export default DashboardHomeTable;
