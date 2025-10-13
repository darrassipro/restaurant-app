import { User } from '../../types/auth';
import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ status: boolean; data: { users: User[]; pagination: any } }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 50 }) => `/v1/users?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query<{ status: boolean; data: { user: User } }, number>({
      query: (id) => `/v1/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<
      { status: boolean; message: string; data: { user: User } },
      {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
        password: string;
      }
    >({
      query: (userData) => ({
        url: '/v1/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<
      { status: boolean; message: string; data: { user: Partial<User> } },
      { id: number; updates: Partial<User> }
    >({
      query: ({ id, updates }) => ({
        url: `/v1/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<{ status: boolean; message: string }, number>({
      query: (id) => ({
        url: `/v1/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;