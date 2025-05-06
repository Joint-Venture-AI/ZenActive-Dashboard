import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { useGetAllTransactionQuery } from "../../../redux/features/transaction/transactionApi";

const dataWeekly = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 150 },
  { day: "Wed", value: 80 },
  { day: "Thu", value: 170 },
  { day: "Fri", value: 100 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 130 },
];

const dataDaily = [
  { day: "12 AM", value: 30 },
  { day: "6 AM", value: 50 },
  { day: "12 PM", value: 90 },
  { day: "6 PM", value: 70 },
  { day: "12 AM", value: 30 },
];

const CustomXAxisTick = ({ x, y, payload }) => (
  <text
    x={x}
    y={y + 10}
    textAnchor="middle"
    fontSize={14}
    fill="#4B4B4B"
    className="cursor-pointer font-semibold hover:fill-[#1E648C]"
  >
    {payload.value}
  </text>
);

const CustomTooltip = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          padding: "5px 10px",
        }}
      >
        <p>{`${payload[0].payload.day} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// const CustomCursor = (props) => {
//     const {
//         stroke, height, points, className,
//     } = props;
//     const { x, y } = points[0];
//     return (
//         <Rectangle
//             x={x - 5} // Cursor x-position
//             y={y} // Cursor y-position
//             width={10} // Fixed width of the cursor
//             height={height} // Match height of the chart
//             // fill="#1E648C"
//             fillOpacity={0.2}
//             stroke={stroke || "#8884d8"} // Default stroke color if not provided
//             strokeWidth={2} // Optional: Adjust stroke width
//             rx={5} // Border radius (rounded corners)
//             ry={5} // Vertical border radius
//             points={points}
//         />
//     );
// };

const TransactionAreaChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("weekly");
  const { data: transactions } = useGetAllTransactionQuery(filter);

  useEffect(() => {
    if (transactions?.data) {
      const formattedData = transactions.data.map((item) => ({
        day: new Date(item.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: item.earnings,
      }));
      setData(formattedData);
    }
  }, [transactions, filter]);

  const handleFilterChange = (event) => {
    const type = event.target.value;
    setFilter(type);
    // setData(type === "weekly" ? dataWeekly : dataDaily);
  };

  return (
    <div className="space-y-3">
      <div className="lg:w-[414px] border border-[#37B5FF] rounded-lg flex items-center justify-between px-2">
        <h1 className="text-xl">Your Transactions</h1>
        <div className="flex justify-center">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-transparent border-none rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#37B5FF]"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div className="lg:w-[414px] border border-[#37B5FF] rounded-lg">
        <ResponsiveContainer width="100%" height={172}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E648C" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1E648C" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={(props) => <CustomXAxisTick {...props} />}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{
                strokeWidth: "9px", // Increases the tooltip line thickness
                stroke: "#1E648C",
              }}
              cursor={{
                stroke: "#1E648C",
                strokeWidth: 10,
                strokeOpacity: 0.5,
                strokeLinecap: "round",
              }}
              // cursor={<CustomCursor />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1E648C"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionAreaChart;
