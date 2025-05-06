import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Dropdown } from "antd";
import profileImage from "../../assets/images/dash-profile.png";
import { HiOutlineBell } from "react-icons/hi2";
import {
  MdManageHistory,
  MdMenu,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/features/auth/authSlice";
import defaultAvatar from "../../assets/images/avatar.png";
import {
  DashboardOutlined,
  DollarOutlined,
  UserOutlined,
  CrownOutlined,
  CoffeeOutlined,
  // BicycleOutlined,
  // DumbbellOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  ShoppingOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { PiPersonSimpleBikeBold } from "react-icons/pi";
import { CiDumbbell } from "react-icons/ci";

const Header = () => {
  const navigate = useNavigate();
  const loacatin = useLocation();
  const notificationRef = useRef(null);
  const [notificationPopup, setNotificationPopup] = useState(false);

  const user = useSelector(useCurrentUser);

  const handleChange = (value) => {
    // console.log(`selected ${value}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setNotificationPopup(false);
  }, [loacatin.pathname]);

  const items = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: <Link to="/earnings">Earnings</Link>,
      key: "earnings",
      icon: <DollarOutlined />,
    },
    {
      label: <Link to="/users">Users</Link>,
      key: "users",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/subscription">Subscription</Link>,
      key: "subscription",
      icon: <CrownOutlined />,
    },
    {
      label: <Link to="/meals">Meals</Link>,
      key: "meals",
      icon: <CoffeeOutlined />,
    },
    {
      label: <Link to="/exercise">Exercise</Link>,
      key: "exercise",
      icon: <PiPersonSimpleBikeBold />,
    },
    {
      label: <Link to="/workouts">Workouts</Link>,
      key: "workouts",
      icon: <CiDumbbell />,
    },
    {
      label: <Link to="/workoutPlans">Workout Plans</Link>,
      key: "workout-plans",
      icon: <MdManageHistory />,
    },
    {
      label: <Link to="/workout-videos">Workout Videos</Link>,
      key: "workout-videos",
      icon: <VideoCameraOutlined />,
    },
    {
      label: <Link to="/store">Store</Link>,
      key: "store",
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to="/settings">Settings</Link>,
      key: "settings",
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div className="w-full h-[88px] flex justify-between items-center rounded-sm py-[16px] px-[32px] shadow-lg bg-[#174C6B]">
      <div className="text-start space-y-0.5">
        {/* <p className="text-sm md:text-xl font-light">
          {"Welcome, Jane Cooper"}
        </p>
        <p className="text-sm md:text-xl">{"Have a nice day!"}</p> */}
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          className="block lg:hidden"
        >
          <MdMenu color="white" size={30} />
        </Dropdown>
        {/* <button className="lg:hidden block">
          
        </button> */}
      </div>
      <div className="flex gap-x-[41px]">
        {/* <div
          onClick={(e) => navigate("/notifications")}
          className="relative flex items-center "
        >
          <Badge style={{ backgroundColor: "#37B5FF", width: '20px', height: '20px', objectFit: 'contain' }} count={1}>
            <div className="bg-[#EBF8FF] p-2 rounded-full">
              <HiOutlineBell
                style={{ cursor: "pointer" }}
                className={` w-6 h-6 rounded-full shadow-sm  font-bold transition-all text-darkBlue`}
              />
            </div>
          </Badge>
        </div> */}
        <div className="flex items-center gap-4">
          <div>
            <img
              src={import.meta.env.VITE_BASE_URL + user?.image}
              alt="profile avatar"
              className="rounded-full h-[42px] w-[42px]"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-white text-lg">{user?.name}</h1>
            <h1 className="text-white text-xs">Admin</h1>
          </div>
          {/* <Select
            defaultValue="Jane Cooper"
            style={{
              width: 120,
            }}
            bordered={false}
            suffixIcon={<MdOutlineKeyboardArrowDown color="black" fontSize={20} />}
            onChange={handleChange}
            options={[
              {
                value: 'Jane Cooper',
                label: 'Jane Cooper',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              }
            ]}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
