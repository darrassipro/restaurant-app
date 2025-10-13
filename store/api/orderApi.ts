import { CreateOrderRequest, Order } from '../../types/order';
import { apiSlice } from './apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      { status: string; message: string; data: Order },
      CreateOrderRequest
    >({
      query: (orderData) => ({
        url: '/order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query<{ status: string; results: number; data: Order[] }, void>({
      query: () => '/order',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<{ status: string; data: Order }, number>({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<
      { status: string; message: string; data: Partial<Order> },
      { id: number; newStatus: Order['status'] }
    >({
      query: ({ id, newStatus }) => ({
        url: `/order/${id}/status`,
        method: 'PUT',
        body: { newStatus },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order'],
    }),
    getCustomerOrders: builder.query<{ status: string; results: number; data: Order[] }, number>({
      query: (customerId) => `/order/customer/${customerId}`,
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Order' as const, id })), 'Order']
          : ['Order'],
    }),
    getRestaurantOrders: builder.query<{ status: string; results: number; data: Order[] }, void>({
      query: () => '/order/restaurant/me',
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetCustomerOrdersQuery,
  useGetRestaurantOrdersQuery,
} = orderApi;