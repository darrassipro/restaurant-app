import { Category } from '../../types/dish';
import { apiSlice } from './apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ status: string; data: Category[] }, void>({
      query: () => '/categorys',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<{ status: string; data: Category }, number>({
      query: (id) => `/categorys/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<{ status: string; data: Category }, Partial<Category>>({
      query: (category) => ({
        url: '/categorys',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<
      { status: string; data: Partial<Category> },
      { id: number; category: Partial<Category> }
    >({
      query: ({ id, category }) => ({
        url: `/categorys/${id}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteCategory: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/categorys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;