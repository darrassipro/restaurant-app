// store/api/authApi.ts
import { AuthResponse, LoginRequest, OtpVerification, RegisterRequest, User } from '../../types/auth';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyRegistrationOtp: builder.mutation<
      { status: boolean; message: string },
      { otp: string; identifier: string }
    >({
      query: ({ otp, identifier }) => ({
        url: '/v1/auth/verify-registration-otp',
        method: 'POST',
        body: { otp, identifier },
      }),
    }),
     // Réinitialiser OTP mot de passe
    resetPasswordOtp: builder.mutation<
      { status: boolean; message: string },
      { otp: string; identifier: string }
    >({
      query: ({ otp, identifier }) => ({
        url: '/v1/auth/reset-password-otp',
        method: 'POST',
        body: { otp, identifier },
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    completeRegistration: builder.mutation<AuthResponse, OtpVerification>({
      query: (data) => ({
        url: '/auth/complete-registration',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyLoginOtp: builder.mutation<AuthResponse, { identifier: string; password: string; otp: string }>({
      query: (data) => ({
        url: '/auth/verify-login-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation<{ status: boolean; message: string; expiresAt: string }, { identifier: string; type: string }>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email?: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ status: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query<{ status: boolean; data: { user: User } }, void>({
      query: () => '/v1/users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<{ status: boolean; message: string; data: { user: User } }, Partial<User>>({
      query: (data) => ({
        url: '/v1/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<
      { status: boolean; message: string; token: string },
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: '/v1/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useVerifyRegistrationOtpMutation,
  useResetPasswordOtpMutation,
  useRegisterMutation,
  useCompleteRegistrationMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;