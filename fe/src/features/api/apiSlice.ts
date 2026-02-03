import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { AUTH_SESSION_TOKEN } from "../../../constants/tokenKey";
import { deleteAllLocalStoreData } from "../Cookies/cookiesHelper";

const prepareAuthHeaders = (headers: Headers) => {
  const token = Cookies.get(AUTH_SESSION_TOKEN);
  if (token) headers.set("Authorization", token);
  return headers;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: prepareAuthHeaders,
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const err = result.error as FetchBaseQueryError;

    if (err.status === 401) {
      await deleteAllLocalStoreData();
      localStorage.clear();
      window.location.href = "/";
    }

    if (err.status === 502) {
      await deleteAllLocalStoreData();
      window.location.reload();
    }
  }

  return result;
};


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["AdminAuth", "UserAuth", "Document", "Query"],
  endpoints: (builder) => ({

    adminSignup: builder.mutation({
      query: (formData) => ({
        url: "admin/auth/signup",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    adminLogin: builder.mutation({
      query: (formData) => ({
        url: "admin/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    getAdminProfile: builder.query({
      query: () => ({
        url: "admin/auth/get",
        method: "GET",
      }),
      providesTags: ["AdminAuth"],
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: "admin/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    adminGetDocument: builder.query({
      query: () => ({
        url: "admin/user/document/get",
        method: "GET",
      }),
      providesTags: ["Document"],
    }),


    userSignup: builder.mutation({
      query: (formData) => ({
        url: "user/auth/signup",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserAuth"],
    }),

    userLogin: builder.mutation({
      query: (formData) => ({
        url: "user/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserAuth"],
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: "user/auth/get",
        method: "GET",
      }),
      providesTags: ["UserAuth"],
    }),

    userLogout: builder.mutation({
      query: () => ({
        url: "user/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["UserAuth"],
    }),

    getDocument: builder.query({
      query: () => ({
        url: "user/document/get",
        method: "GET",
      }),
      providesTags: ["Document"],
    }),

    uploadDocument: builder.mutation({
      query: (formData: FormData) => ({
        url: "user/document/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),


    askQuestion: builder.mutation({
      query: (formData) => ({
        url: "user/query/ask",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Query"],
    }),
  }),
});


export const {
  useAdminSignupMutation,
  useAdminLoginMutation,
  useGetAdminProfileQuery,
  useAdminLogoutMutation,
  useAdminGetDocumentQuery,

  useUserSignupMutation,
  useUserLoginMutation,
  useGetUserProfileQuery,
  useUserLogoutMutation,

  useUploadDocumentMutation,
  useGetDocumentQuery,
  useAskQuestionMutation,
} = apiSlice;


export interface ApiErrorResponse {
  status: number;
  data: {
    error: string
    status: boolean;
    message: string;
  };
}
