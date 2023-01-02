/* eslint-disable import/no-cycle */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  IGetUserDataResponse,
  ILoginPayload,
  IRegisterPayload,
  IUserInterface,
  TLoginApiResponse
} from '../../../Types/UserInterface';
import store from '../../App/store';

const baseUrl = 'http://52.59.237.207/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const { token: userToken } = store.getState().userAuth.data;
      const { token: adminToken } = store.getState().adminAuth.data;
      if (window.location.href.includes('admin')) {
        headers.set('authorization', `Bearer ${adminToken}`);
      } else {
        headers.set('authorization', `Bearer ${userToken}`);
      }
      return headers;
    }
  }),
  tagTypes: ['user', 'admin'],

  endpoints: (builder) => ({
    userLogin: builder.mutation<{ status: string } & TLoginApiResponse, ILoginPayload>({
      query: (data) => ({
        url: '/user/login',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['user']
    }),

    userSignup: builder.mutation<{ status: string } & TLoginApiResponse, IRegisterPayload>({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['user']
    }),

    getUserData: builder.query<IGetUserDataResponse, void>({
      query: () => '/user/getuser',
      providesTags: ['user']
    }),

    adminLogin: builder.mutation<{ status: string } & TLoginApiResponse, ILoginPayload>({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data
      })
    }),

    adminGetUserData: builder.query<{ users: IUserInterface[] }, void>({
      query: () => 'admin/getuserdata',
      providesTags: ['admin', 'user']
    }),

    adminGetSingleUserData: builder.query<IUserInterface, { id: string }>({
      query: ({ id }) => `admin/getuserdata/${id}`,
      providesTags: ['admin', 'user']
    }),

    adminAddNew: builder.mutation<{ status: string }, IRegisterPayload>({
      query: (data) => ({
        url: '/admin/addnewuser',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['admin']
    }),

    adminEditUser: builder.mutation<{ status: string }, { data: IRegisterPayload; id: string }>({
      query: ({ data, id }) => ({
        url: `/admin/edituserdata/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['admin', 'user']
    }),

    adminDeleteUser: builder.mutation<{ status: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/deleteuser/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['admin', 'user']
    })
  })
});

export const {
  useUserLoginMutation,
  useUserSignupMutation,
  useGetUserDataQuery,
  useAdminLoginMutation,
  useAdminGetUserDataQuery,
  useAdminGetSingleUserDataQuery,
  useAdminAddNewMutation,
  useAdminEditUserMutation,
  useAdminDeleteUserMutation
} = apiSlice;
