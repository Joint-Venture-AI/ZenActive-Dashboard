import { baseApi } from "../../api/baseApi";

export const workoutApi = baseApi.enhanceEndpoints({ addTagTypes: ["Workouts"] }).injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkout: builder.query({
            query: (searchTerm) => {
                const queryParam = searchTerm ? `?searchTerm=${searchTerm}` : '';
                return {
                    url: `/workout${queryParam}`,
                    method: 'GET',
                };
            },
            providesTags: ["Workouts"]
        }),
        getSingleWorkout: builder.query({
            query: (workoutId) => ({
                url: `/workout/${workoutId}`,
                method: 'GET',
            }),
            providesTags: ["Workouts"]
        }),
        createWorkout: builder.mutation({
            query: (workout) => ({
                url: '/workout/create-workout',
                method: 'POST',
                body: workout,
            }),
            invalidatesTags: ["Workouts"]
        }),
        editWorkout: builder.mutation({
            query: ({ workoutId, formData }) => ({
                url: `/workout/${workoutId}`,
                method: 'PATCH',
                body: formData
            }),
            invalidatesTags: ["Workouts"]
        }),
        deleteWorkout: builder.mutation({
            query: (workoutId) => ({
                url: `/workout/${workoutId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Workouts"]
        }),
    })
})

export const { useGetAllWorkoutQuery, useCreateWorkoutMutation, useGetSingleWorkoutQuery, useEditWorkoutMutation, useDeleteWorkoutMutation } = workoutApi