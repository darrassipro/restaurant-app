import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { User } from '../../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpVerification: {
    isRequired: boolean;
    identifier: string;
    userData?: any;
    type?: 'registration' | 'login' | 'password_reset';
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  otpVerification: {
    isRequired: false,
    identifier: '',
    userData: null,
    type: undefined,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOtpVerification: (
      state,
      action: PayloadAction<{
        isRequired: boolean;
        identifier: string;
        userData?: any;
        type?: 'registration' | 'login' | 'password_reset';
      }>
    ) => {
      state.otpVerification = action.payload;
    },
    resetOtpVerification: (state) => {
      state.otpVerification = {
        isRequired: false,
        identifier: '',
        userData: null,
        type: undefined,
      };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setLoading, setOtpVerification, resetOtpVerification, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectOtpVerification = (state: RootState) => state.auth.otpVerification;

export default authSlice.reducer;