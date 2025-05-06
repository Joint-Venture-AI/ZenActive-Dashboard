import { FaAngleRight } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router-dom";
import { routeLinkGenerators } from "../../../utils/routeLinkGenerators";
import { dashboardItems } from "../../../constants/router.constants";


const Setting = () => {

  return (
    <div className="rounded-lg py-4 border-[#37B5FF] border-2 shadow-lg mt-8 bg-[#FEFEFF]">
      <h3 className="text-2xl text-[#1E648C] mb-4 pl-5 border-b-2 border-[#37B5FF]/30 pb-3">Settings</h3>
      <div>
        {routeLinkGenerators(dashboardItems)
          .filter(({ children }) => children && children.length > 0) // Ensure only items with children are processed
          .map(({ name, icon, path, children, rootPath }, indx) => (
            <div key={indx} className="space-y-4 container mx-auto max-w-7xl pt-4 pb-32">
              {children.map(({ subName, subPath, subIcon }, inx) => (
                <NavLink
                  key={inx}
                  to={`/${subPath}`}
                  className="flex justify-between items-center p-4 border border-[#5FC4FF] bg-[#EBF8FF] rounded-lg"
                >
                  <span className=" text-xl"> {subName}</span>
                  <div className="text-lg  font-medium ">
                    <FaAngleRight color="#174C6B" />
                  </div>
                </NavLink>
              ))}
            </div>
          ))}
      </div>
      <div className="p-[24px] pt-0.5">
        <Outlet />
      </div>
    </div>
  )
}

export default Setting
