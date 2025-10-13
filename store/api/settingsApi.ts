import { apiSlice } from './apiSlice';

interface Settings {
  allowRegistration: boolean;
  requireEmailVerificationRegister: boolean;
  requireEmailVerificationLogin: boolean;
  maintenanceMode: boolean;
  maxOrdersPerDay: number;
  deliveryFee: number;
  taxRate: number;
  currencySymbol: string;
  appName: string;
  supportEmail: string;
  supportPhone: string;
}

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ status: boolean; data: Settings }, void>({
      query: () => '/v1/settings',
    }),
    updateSettings: builder.mutation<{ status: boolean; message: string }, Partial<Settings>>({
      query: (settings) => ({
        url: '/v1/settings',
        method: 'PUT',
        body: settings,
      }),
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;