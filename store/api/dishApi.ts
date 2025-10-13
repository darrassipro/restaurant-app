import { Dish } from '../../types/dish';
import { apiSlice } from './apiSlice';

export const dishApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDishes: builder.query<
      { status: string; results: number; pagination: any; data: Dish[] },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/dishes?page=${page}&limit=${limit}`,
      providesTags: ['Dish'],
    }),
    getDishById: builder.query<Dish, number>({
      query: (id) => `/dishes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Dish', id }],
    }),
    getDishesByCategory: builder.query<Dish[], number>({
      query: (categoryId) => `/dishes/category/${categoryId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Dish' as const, id })), 'Dish']
          : ['Dish'],
    }),
    createDish: builder.mutation<{ message: string; dish: Dish }, FormData>({
      query: (formData) => ({
        url: '/dishes',
        method: 'POST',
        body: formData,
        formData: true, // Important for sending files
      }),
      invalidatesTags: ['Dish'],
    }),
    updateDish: builder.mutation<{ message: string; dish: Partial<Dish> }, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/dishes/${id}`,
        method: 'PUT',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Dish', id }, 'Dish'],
    }),
    deleteDish: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/dishes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dish'],
    }),
  }),
});

export const {
  useGetDishesQuery,
  useGetDishByIdQuery,
  useGetDishesByCategoryQuery,
  useCreateDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
} = dishApi;