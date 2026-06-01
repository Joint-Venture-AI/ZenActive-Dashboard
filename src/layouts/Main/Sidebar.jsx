import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo1.png";
import { createElement, useEffect } from "react";
import { routeLinkGenerators } from "../../utils/routeLinkGenerators";
import { dashboardItems } from "../../constants/router.constants";
import Swal from "sweetalert2";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you want to Log out from this site? ",
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
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/auth");
      }
    });
  };

  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-[290px] min-h-screen h-full pr-0 bg-[#174C6B]">
      <div className="h-full flex flex-col justify-between pt-[50px] border drop-shadow">
        <div className="space-y-[24px]">
          <div className="px-[38px]">
            <img className="w-full mx-auto" src={logo} alt="" />
          </div>
          <ul className="mt-10 max-h-[650px] overflow-y-auto space-y-1 xl:space-y-2 px-4">
            {routeLinkGenerators(dashboardItems).map(
              ({ name, icon, path, children }, indx) =>
                children?.length ? null : (
                  <li key={indx}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-[#EBF8FF] text-[#174C6B]" +
                            " w-full px-4 py-3 flex items-center justify-start gap-[24px]  transition-all rounded-xl"
                          : " hover:text-[#174C6B]  hover:bg-[#EBF8FF] text-[#EBF8FF]" +
                            " w-full px-4 py-3 flex items-center justify-start gap-[24px]  transition-all rounded-xl"
                      }
                    >
                      <div>{createElement(icon, { size: "24" })}</div>
                      <span className="text-[18px]"> {name}</span>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
        </div>
        <div className="p-4 mt-auto text-center">
          <button
            onClick={handleLogOut}
            className="w-full font-semibold px-12 py-3 flex items-center justify-center gap-3 text-md outline-none rounded-full text-2xl"
          >
            <IoLogOutOutline className="text-[#E77775]" />
            <span className="text-[#E77775] font-light">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
