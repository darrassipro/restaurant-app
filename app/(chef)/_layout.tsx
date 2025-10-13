// app/(chef)/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function ChefLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FF5733',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kitchen"
        options={{
          title: 'Cuisine',
          tabBarIcon: ({ color }) => <Feather name="thermometer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color }) => <Feather name="clock" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}