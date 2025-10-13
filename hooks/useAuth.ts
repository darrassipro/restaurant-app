import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery, useLogoutMutation } from '../store/api/authApi';
import { selectIsAuthenticated, selectUser, setLoading, setUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [logout] = useLogoutMutation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Just attempt to fetch the current user
        if (data?.status && data?.data?.user) {
          dispatch(setUser(data.data.user));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, data]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(setUser(null));
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
    refetch,
  };
};