import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/constants';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // No need to set authorization headers as we're using HTTP-only cookies
      return headers;
    },
    credentials: 'include', // This is important for cookies
  }),
  tagTypes: ['User', 'Dish', 'Category', 'Order', 'Restaurant', 'Inventory', 'Address'],
  endpoints: () => ({}),
});