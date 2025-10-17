import { Address } from '../../types/address';
import { apiSlice } from './apiSlice';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => '/addresses',
      providesTags: ['Address'],
      // backend returns an array directly: res.status(200).json(addresses)
      transformResponse: (response: any) => response,
    }),
    getAddressById: builder.query<Address, number>({
      query: (id) => `/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Address', id }],
      // backend returns the address object directly
      transformResponse: (response: any) => response,
    }),
    createAddress: builder.mutation<Address, Partial<Address>>({
      query: (address) => ({
        url: '/addresses',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['Address'],
      // backend returns { message: '...', address: newAddress }
      transformResponse: (response: any) => response?.address ?? response,
    }),
    updateAddress: builder.mutation<Address, { id: number; address: Partial<Address> }>({
      query: ({ id, address }) => ({
        url: `/addresses/${id}`,
        method: 'PUT',
        body: address,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Address', id }, 'Address'],
      // backend returns { message: '...', address: updatedAddress }
      transformResponse: (response: any) => response?.address ?? response,
    }),
    deleteAddress: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
      // backend returns { message: '...' }
      transformResponse: (response: any) => response,
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