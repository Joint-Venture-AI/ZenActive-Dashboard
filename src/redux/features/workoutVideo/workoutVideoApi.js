import { baseApi } from "../../api/baseApi";

export const workoutVideoApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["WorkoutVideos"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getWorkoutVideos: builder.query({
        query: (searchTerm) => {
          const queryParam = searchTerm ? `?searchTerm=${searchTerm}` : "";
          return {
            url: `/workout-video${queryParam}`,
            method: "GET",
          };
        },
        transformResponse: (res) => {
          const result = {
            ...res,
            data: res?.data?.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }),
          };

          return result;
        },
        providesTags: ["WorkoutVideos"],
      }),
      getSingleWorkoutVideo: builder.query({
        query: (workoutId) => ({
          url: `/workout-video/${workoutId}`,
          method: "GET",
        }),
        providesTags: ["WorkoutVideos"],
      }),
      createWorkoutVideo: builder.mutation({
        query: (workoutVideo) => ({
          url: "/workout-video",
          method: "POST",
          body: workoutVideo,
        }),
        invalidatesTags: ["WorkoutVideos"],
      }),
      editWorkoutVideo: builder.mutation({
        query: ({ workoutId, formData }) => ({
          url: `/workout-video/${workoutId}`,
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: ["WorkoutVideos"],
      }),
      deleteWorkoutVideo: builder.mutation({
        query: (workoutId) => ({
          url: `/workout-video/${workoutId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["WorkoutVideos"],
      }),
    }),
  });

export const {
  useGetWorkoutVideosQuery,
  useCreateWorkoutVideoMutation,
  useGetSingleWorkoutVideoQuery,
  useEditWorkoutVideoMutation,
  useDeleteWorkoutVideoMutation,
} = workoutVideoApi;
