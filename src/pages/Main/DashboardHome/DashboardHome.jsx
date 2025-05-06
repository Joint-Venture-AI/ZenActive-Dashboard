import DashboardHomeTable from "../../../Components/DashboardHomeTable";
import { useGetTotalUsersQuery } from "../../../redux/features/auth/authApi";
import { useGetTotalEarningsQuery } from "../../../redux/features/transaction/transactionApi";
import BarChartComponent from "./BarChart";
import TransactionAreaChart from "./TransactionAreaChart";

const DashboardHome = () => {
  const { data: totalEarnings } = useGetTotalEarningsQuery();
  const { data: totalUsers } = useGetTotalUsersQuery();

  return (
    <div className="space-y-[24px]">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-32  gap-y-10  */}

        {/* Transaction Area Chart */}
        <TransactionAreaChart />
        {/* <div className=" flex items-center justify-center gap-6 border border-black px-[24px] py-[20px] rounded-lg space-y-3 bg-white w-80">

          <div className="text-center">
            <h3 className="text-[20px]">{"Total Earnings"}</h3>
            <h3 className="text-[30px] font-extralight">
              {`$8920 `}
            </h3>
          </div>
        </div> */}

        <div className="flex items-center gap-6 px-[24px] bg-[#1E648C] border border-black  py-[20px] rounded-lg space-y-3  w-80">
          <div className="">
            <h3 className="text-[20px] text-white">{"Total Earnings"}</h3>
            <h3 className="text-[30px] text-white font-extralight">
              ${totalEarnings?.data?.totalEarn}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6 border border-lightBlue px-[24px] py-[20px] rounded-lg space-y-3 bg-white w-80 text-[#174C6B]">
          <div className="">
            <h3 className="text-[20px] text-gray font-semibold">
              {"Total Users"}
            </h3>
            <h3 className="text-[30px] font-extralight text-[#2683EB]">
              {totalUsers?.data?.totalUsers}
            </h3>
          </div>
        </div>
      </div>
      {/* <BarChartComponent/> */}
      <DashboardHomeTable />
    </div>
  );
};

export default DashboardHome;
