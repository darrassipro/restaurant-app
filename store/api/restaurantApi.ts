import { Dish } from '../../types/dish';
import { Restaurant } from '../../types/restaurant';
import { apiSlice } from './apiSlice';

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query<Restaurant & { dishes?: Dish[] }, void>({
      query: () => '/restaurant',
      providesTags: ['Restaurant'],
      transformResponse: (response: { status: boolean; data: Restaurant & { dishes?: Dish[] } }) => response.data,
    }),
    getRestaurantById: builder.query<Restaurant, number>({
      query: (id) => `/restaurant/${id}`,
      providesTags: (result, error, id) => [{ type: 'Restaurant', id }],
      transformResponse: (response: { status: boolean; data: Restaurant }) => response.data,
    }),
    updateRestaurant: builder.mutation<Restaurant, { id: number; restaurant: Partial<Restaurant> }>({
      query: ({ id, restaurant }) => ({
        url: `/restaurant/${id}`,
        method: 'PUT',
        body: restaurant,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Restaurant', id }, 'Restaurant'],
      transformResponse: (response: { status: boolean; message: string; data: Restaurant }) => response.data,
    }),
  }),
});

export const {
  useGetRestaurantQuery,
  useGetRestaurantByIdQuery,
  useUpdateRestaurantMutation,
} = restaurantApi;