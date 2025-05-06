import { baseApi } from "../../api/baseApi";

export const exerciseApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Exercises"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllExercise: builder.query({
        query: (searchTerm) => {
          const queryParam = searchTerm ? `name=${searchTerm}` : "";
          return {
            url: `/exercise?limit=999&${queryParam}`,
            method: "GET",
          };
        },
        transformResponse: (res) => {
          let result = {
            ...res,
            data: res?.data?.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }),
          };

          return result;
        },
        providesTags: ["Exercises"],
      }),
      getSingleExercise: builder.query({
        query: (exerciseId) => ({
          url: `/exercise/${exerciseId}`,
          method: "GET",
        }),
        providesTags: ["Exercises"],
      }),
      createExercise: builder.mutation({
        query: (exercise) => ({
          url: "/exercise",
          method: "POST",
          body: exercise,
        }),
        invalidatesTags: ["Exercises"],
      }),
      editExercise: builder.mutation({
        query: ({ exerciseId, formData }) => ({
          url: `/exercise/${exerciseId}`,
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: ["Exercises"],
      }),
      deleteExercise: builder.mutation({
        query: (exerciseId) => ({
          url: `/exercise/${exerciseId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Exercises"],
      }),
    }),
  });

export const {
  useGetAllExerciseQuery,
  useCreateExerciseMutation,
  useGetSingleExerciseQuery,
  useEditExerciseMutation,
  useDeleteExerciseMutation,
} = exerciseApi;
