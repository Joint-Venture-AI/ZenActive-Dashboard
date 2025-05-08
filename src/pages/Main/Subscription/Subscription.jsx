
import tickImg from "../../../assets/images/check-circle.png";

import { useGetAllSubscriptionPlanQuery } from "../../../redux/features/subscription/subscriptionApi";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const Subscription = () => {
  const { data, isLoading } = useGetAllSubscriptionPlanQuery();
  const plans = data?.data || [];

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      <div className="py-20 px-4 md:px-10">
        <div className="flex flex-wrap justify-center gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-[#37B5FF]/80 rounded-xl w-full max-w-sm py-6 shadow-sm"
            >
              <div className="flex flex-col items-center justify-center gap-2 pb-5 border-b-2 border-b-[#2781B5]/20 min-h-[117px] px-4 text-center">
                <h1 className="text-xl font-semibold text-[#174C6B]">
                  {plan.name}
                </h1>
                <div className="flex items-center justify-center gap-2 text-lg text-[#2781B5]">
                  <span>{plan.price === 0 ? "" : "$"}</span>
                  <h2>{plan.price === 0 ? "Free" : plan.price}</h2>
                  <span className="text-sm text-[#2781B5]">
                    {plan.price === 0
                      ? ""
                      : plan.name.toLowerCase().includes("month")
                      ? "/Month"
                      : "/Yearly"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-8 py-6 px-4">
                <div className="space-y-4 w-full">
                  {plan.features.map((option, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <img
                        src={tickImg}
                        alt="Tick"
                        className="w-5 h-5 shrink-0"
                      />
                      <h3 className="text-[16px] text-[#525252] font-semibold">
                        {option}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
