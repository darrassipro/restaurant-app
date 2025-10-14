// app/(chef)/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

// Remove any dynamic styling - use fixed Tailwind classes
export default function ChefLayout() {
  const user = useSelector(selectUser);

  // Redirect if not chef
  useEffect(() => {
    if (user && user.role !== 'chef') {
      router.replace('/login' as never);
    }
  }, [user]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5733',
        headerStyle: {
          backgroundColor: '#FF5733',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="kitchen"
        options={{
          title: 'Cuisine',
          tabBarIcon: ({ color }) => <Feather name="thermometer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      {/* Hide this screen from the tab bar */}
      <Tabs.Screen
        name="order-details/[id]"
        options={{
          href: null,
          title: 'Détails de commande',
        }}
      />
    </Tabs>
  );
}