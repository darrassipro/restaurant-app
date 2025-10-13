import { Address } from '../../types/restaurant';
import { apiSlice } from './apiSlice';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => '/addresses',
      providesTags: ['Address'],
    }),
    getAddressById: builder.query<Address, number>({
      query: (id) => `/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Address', id }],
    }),
    createAddress: builder.mutation<{ message: string; address: Address }, Partial<Address>>({
      query: (address) => ({
        url: '/addresses',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation<{ message: string; address: Partial<Address> }, { id: number; address: Partial<Address> }>({
      query: ({ id, address }) => ({
        url: `/addresses/${id}`,
        method: 'PUT',
        body: address,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Address', id }, 'Address'],
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