import { useState } from "react";
import tickImg from "../../../assets/images/check-circle.png";
import tickImgWhite from "../../../assets/images/check-circle-white.png";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AddNewButton from "../../../Components/AddNewButton";
import Swal from "sweetalert2";

const plans = [
  {
    id: 1,
    name: "1month Free Trial",
    price: 0,
    features: [
      "Personalized meal plans",
      "Adaptive fitness recommendations",
      "Offline access",
      "Premium challenges and rewards",
    ],
    period: "monthly",
    isRecommended: false,
  },
  {
    id: 2,
    name: "Monthly Subscription",
    price: 20,
    features: [
      "Personalized meal plans",
      "Adaptive fitness recommendations",
      "Premium challenges and rewards",
      "Daily Energy Expenditure Calculator",
      "Mood Tracking",
      "Emotional Support",
      "Offline access",
      "Ad-free experience",
    ],
    period: "monthly",
    isRecommended: true,
  },
  {
    id: 3,
    name: "Annual Subscription",
    price: 79.99,
    features: ["Everything in Monthly Plan", "Save 50% with annual Plan"],
    period: "yearly",
    isRecommended: false,
  },
];
const Subscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // console.log('Clicked in handleSubscribe')

    try {
      const res = await fetch(
        `http://192.168.10.32:5002/api/v1/subscription/subscribe?plan=starter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `Failed to subscribe: ${res.status} ${res.statusText}. ${errorData}`
        );
      }

      const data = await res.json();
      //   console.log("Subscription successful:", data);
      if (data && data.data.url) {
        window.location.href = data.data.url; // Redirects to the URL
      } else {
        throw new Error("Stripe URL not provided in response.");
      }
      // Handle successful subscription here (e.g., redirect to a success page)
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      text: "Are you sure you want to delete this subscription? ",
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
        // dispatch(logout());
        // localStorage.removeItem("token");
        // localStorage.removeItem("user-update");
        // navigate("/auth");
      }
    });
  };
  return (
    <div>
      {/* <button className="px-6 py-2 min-w-[100px] text-center text-white bg-[#174C6B] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring float-end flex items-center gap-2" onClick={() => navigate("/add-subscription")}>
                <FaPlus />
                Add new subscription</button> */}
      {/* <AddNewButton text={'Add new subscription'} path={'/add-subscription'} /> */}
      <div className="py-20">
        <div className="flex items-center justify-center gap-12">
          {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
          <div className="flex items-start gap-10">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${
                  plan.isRecommended
                    ? "bg-[#1E648C]"
                    : "bg-white border border-[#37B5FF]/80"
                } rounded-xl w-[352px] py-6`}
              >
                <div
                  className={`flex flex-col items-center justify-center  gap-2 pb-5 border-b-2 ${
                    plan.isRecommended
                      ? "border-b-[#EBF8FF]/20"
                      : "border-b-[#2781B5]/20"
                  }  min-h-[117px]`}
                >
                  <h1
                    className={`text-xl font-semibold text-center ${
                      plan.isRecommended
                        ? "text-[#FBFDFD]/90"
                        : "text-[#174C6B]"
                    }`}
                  >
                    {plan.name}
                  </h1>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center text-lg ${
                        plan.isRecommended
                          ? "text-[#FBFDFD]/90"
                          : "text-[#2781B5]"
                      } `}
                    >
                      <span>{plan.price === 0 ? "" : "$"}</span>
                      <h2>{plan.price === 0 ? "Free" : plan.price}</h2>
                    </div>
                    <span
                      className={`text-sm ${
                        plan.isRecommended
                          ? "text-[#FBFDFD]/90"
                          : "text-[#2781B5]"
                      }`}
                    >
                      {plan.price === 0
                        ? ""
                        : plan.period === "yearly"
                        ? "/year"
                        : "/month"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-8 py-6">
                  <div className="space-y-5 flex flex-col items-start justify-center">
                    {plan.features.map((option, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <img
                          src={plan.isRecommended ? tickImgWhite : tickImg}
                          alt="Tick image"
                          className="w-5 h-5"
                        />

                        <h3
                          className={`text-[16px] ${
                            plan.isRecommended
                              ? "text-[#FBFDFD]/90"
                              : "text-[#525252]"
                          }  font-semibold`}
                        >
                          {option}
                        </h3>
                      </div>
                    ))}
                    {/* {plan.options.map((option, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Image
                                                src={tickImg}
                                                alt='Tick image'
                                                height={15}
                                                width={15}
                                            />
                                            <h3 className="text-xs">{option}</h3>
                                        </div>
                                        ))} */}
                  </div>
                  <div className="flex  items-center gap-3">
                    <button
                      className="px-12 py-2.5 w-full text-center text-lg text-[#174C6B] bg-[#EBF8FF] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      className={`px-12 py-2.5 w-full text-center text-lg text-white bg-[#174C6B] border border-[#174C6B] rounded-md active:text-[#174C6B] hover:bg-transparent hover:text-[#174C6B] focus:outline-none focus:ring`}
                      onClick={() => navigate("/edit-subscription")}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
