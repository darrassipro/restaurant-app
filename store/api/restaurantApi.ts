import { Dish } from '../../types/dish';
import { Restaurant } from '../../types/restaurant';
import { apiSlice } from './apiSlice';

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query<{ status: boolean; data: Restaurant & { dishes: Dish[] } }, void>({
      query: () => '/restaurant',
      providesTags: ['Restaurant'],
    }),
    getRestaurantById: builder.query<{ status: boolean; data: Restaurant }, number>({
      query: (id) => `/restaurant/${id}`,
      providesTags: (result, error, id) => [{ type: 'Restaurant', id }],
    }),
    updateRestaurant: builder.mutation<
      { status: boolean; message: string; data: Partial<Restaurant> },
      { id: number; restaurant: Partial<Restaurant> }
    >({
      query: ({ id, restaurant }) => ({
        url: `/restaurant/${id}`,
        method: 'PUT',
        body: restaurant,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Restaurant', id }, 'Restaurant'],
    }),
  }),
});

export const {
  useGetRestaurantQuery,
  useGetRestaurantByIdQuery,
  useUpdateRestaurantMutation,
} = restaurantApi;