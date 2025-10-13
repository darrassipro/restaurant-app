import { Inventory } from '../../types/inventory';
import { apiSlice } from './apiSlice';

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<{ status: string; data: Inventory[] }, void>({
      query: () => '/inventory',
      providesTags: ['Inventory'],
    }),
    getLowStockInventory: builder.query<{ status: string; data: Inventory[] }, void>({
      query: () => '/inventory/low-stock',
      providesTags: ['Inventory'],
    }),
    getInventoryById: builder.query<Inventory, number>({
      query: (id) => `/inventory/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),
    updateInventory: builder.mutation<
      { message: string; data: Partial<Inventory> },
      { id: number; updates: Partial<Inventory> }
    >({
      query: ({ id, updates }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }, 'Inventory'],
    }),
    restockInventory: builder.mutation<
      { status: string; message: string; data: Partial<Inventory> },
      { id: number; currentStock: number }
    >({
      query: ({ id, currentStock }) => ({
        url: `/inventory/${id}/restock`,
        method: 'POST',
        body: { currentStock },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }, 'Inventory'],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetLowStockInventoryQuery,
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
  useRestockInventoryMutation,
} = inventoryApi;