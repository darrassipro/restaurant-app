// app/(admin)/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import AdminDrawerContent from '../../components/Admin/AdminDrawerContent';

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <AdminDrawerContent {...props} />}
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
        name="users" 
        options={{ 
          title: 'Utilisateurs',
          drawerIcon: ({ color }) => <Feather name="users" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="categories" 
        options={{ 
          title: 'Catégories',
          drawerIcon: ({ color }) => <Feather name="layers" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="dishes" 
        options={{ 
          title: 'Plats',
          drawerIcon: ({ color }) => <Feather name="coffee" size={22} color={color} />
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
        name="inventory" 
        options={{ 
          title: 'Inventaire',
          drawerIcon: ({ color }) => <Feather name="package" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="analytics" 
        options={{ 
          title: 'Analytique',
          drawerIcon: ({ color }) => <Feather name="bar-chart-2" size={22} color={color} />
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