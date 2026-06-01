import { baseApi } from "../../api/baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateWorkoutPlan: builder.mutation({
      query: (data) => ({
        url: "/ai-agent/generate-workout-plan",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateWorkoutPlanMutation } = aiApi;
