import { Address } from '../../types/address';
import { apiSlice } from './apiSlice';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => '/addresses',
      providesTags: ['Address'],
      transformResponse: (response: { status: boolean; data: Address[] }) => response.data,
    }),
    getAddressById: builder.query<Address, number>({
      query: (id) => `/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Address', id }],
      transformResponse: (response: { status: boolean; data: Address }) => response.data,
    }),
    createAddress: builder.mutation<Address, Partial<Address>>({
      query: (address) => ({
        url: '/addresses',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['Address'],
      transformResponse: (response: { status: boolean; message: string; data: Address }) => response.data,
    }),
    updateAddress: builder.mutation<Address, { id: number; address: Partial<Address> }>({
      query: ({ id, address }) => ({
        url: `/addresses/${id}`,
        method: 'PUT',
        body: address,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Address', id }, 'Address'],
      transformResponse: (response: { status: boolean; message: string; data: Address }) => response.data,
    }),
    deleteAddress: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;