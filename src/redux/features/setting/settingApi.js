import { baseApi } from "../../api/baseApi";

export const settingApi = baseApi.enhanceEndpoints({ addTagTypes: ['Terms', 'Privacy', 'About'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTerm: builder.query({
            query: () => '/privacy&terms/terms',
            providesTags: ['Terms']
        }),
        editTerms: builder.mutation({
            query: (term) => ({
                url: `/privacy&terms/terms`,
                method: 'POST',
                body: term
            }),
            invalidatesTags: ['Terms']
        }),
        getPrivacy: builder.query({
            query: () => '/privacy&terms/privacy',
            providesTags: ['Privacy']
        }),
        editPrivacy: builder.mutation({
            query: (privacy) => ({
                url: `/privacy&terms/privacy`,
                method: 'POST',
                body: privacy
            }),
            invalidatesTags: ['Privacy']
        }),
        getAbout: builder.query({
            query: () => '/privacy&terms/about-us',
            providesTags: ['About']
        }),
        editAbout: builder.mutation({
            query: (about) => ({
                url: `/privacy&terms/about-us`,
                method: 'POST',
                body: about
            }),
            invalidatesTags: ['About']
        }),
    })
})

export const { useGetTermQuery, useEditTermsMutation, useGetPrivacyQuery, useEditPrivacyMutation, useGetAboutQuery, useEditAboutMutation } = settingApi