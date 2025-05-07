import { useState } from "react";
import tickImg from "../../../assets/images/check-circle.png";
import tickImgWhite from "../../../assets/images/check-circle-white.png";
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
      <div className="py-20">
        <div className="flex items-center justify-center gap-12">
          <div className="flex items-start gap-10">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-[#37B5FF]/80 rounded-xl w-[352px] py-6"
              >
                <div className="flex flex-col items-center justify-center gap-2 pb-5 border-b-2 border-b-[#2781B5]/20 min-h-[117px]">
                  <h1 className="text-xl font-semibold text-center text-[#174C6B]">
                    {plan.name}
                  </h1>
                  <div className="flex items-center">
                    <div className="flex items-center text-lg text-[#2781B5]">
                      <span>{plan.price === 0 ? "" : "$"}</span>
                      <h2>{plan.price === 0 ? "Free" : plan.price}</h2>
                    </div>
                    <span className="text-sm text-[#2781B5]">
                      {plan.price === 0 ? "" : plan.name.toLowerCase().includes('month')? "/Month":"/Yearly"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-8 py-6">
                  <div className="space-y-5 flex flex-col items-start justify-center">
                    {plan.features.map((option, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <img
                          src={tickImg}
                          alt="Tick image"
                          className="w-5 h-5"
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
    </div>
  );
};

export default Subscription;
