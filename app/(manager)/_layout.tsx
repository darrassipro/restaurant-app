// app/(manager)/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import ManagerDrawerContent from '../../components/Manager/ManagerDrawerContent';

export default function ManagerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <ManagerDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#FF5733',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen 
        name="dashboard" 
        options={{ 
          title: 'Tableau de bord',
          drawerIcon: ({ color }) => <Feather name="home" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="orders" 
        options={{ 
          title: 'Commandes',
          drawerIcon: ({ color }) => <Feather name="shopping-bag" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="kitchen" 
        options={{ 
          title: 'Cuisine',
          drawerIcon: ({ color }) => <Feather name="thermometer" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="inventory" 
        options={{ 
          title: 'Inventaire',
          drawerIcon: ({ color }) => <Feather name="package" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="reports" 
        options={{ 
          title: 'Rapports',
          drawerIcon: ({ color }) => <Feather name="file-text" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Paramètres',
          drawerIcon: ({ color }) => <Feather name="settings" size={22} color={color} />
        }} 
      />
    </Drawer>
  );
}