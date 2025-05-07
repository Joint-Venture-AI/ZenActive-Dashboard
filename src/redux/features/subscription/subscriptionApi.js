import { baseApi } from "../../api/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptionPlan: builder.query({
      query: () => ({
        url: `/subscription-plan`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllSubscriptionPlanQuery } = subscriptionApi;
