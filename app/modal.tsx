import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGetRestaurantOrdersQuery } from '../store/api/orderApi';
import { useGetRestaurantQuery } from '../store/api/restaurantApi';
import { formatCurrency } from '../utils/formatters';

export default function ModalScreen() {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders'>('stats');
  
  const { data: restaurantData, isLoading: loadingRestaurant } = useGetRestaurantQuery();
  const { data: ordersData, isLoading: loadingOrders } = useGetRestaurantOrdersQuery();
  
  const restaurant = restaurantData;
  const orders = ordersData?.data || [];

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(order => order.createdAt.startsWith(today));
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const isLoading = loadingRestaurant || loadingOrders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aperçu Rapide</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('stats')}
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistiques
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('orders')}
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Commandes Récentes
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {activeTab === 'stats' ? (
            <View>
              {/* Restaurant Info */}
              {restaurant && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{restaurant.name}</Text>
                  <View style={styles.infoRow}>
                    <Feather name="map-pin" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {restaurant.Address?.city}, {restaurant.Address?.sector}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather name="phone" size={16} color="#666" />
                    <Text style={styles.infoText}>{restaurant.phone}</Text>
                  </View>
                </View>
              )}

              {/* Today's Stats */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Aujourd'hui</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
                      <Feather name="shopping-bag" size={24} color="#3B82F6" />
                    </View>
                    <Text style={styles.statValue}>{todaysOrders.length}</Text>
                    <Text style={styles.statLabel}>Commandes</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
                      <Feather name="dollar-sign" size={24} color="#10B981" />
                    </View>
                    <Text style={styles.statValue}>{formatCurrency(todaysRevenue)}</Text>
                    <Text style={styles.statLabel}>Revenus</Text>
                  </View>
                </View>
              </View>

              {/* Pending Orders Alert */}
              {pendingOrders > 0 && (
                <View style={[styles.card, styles.alertCard]}>
                  <View style={styles.alertHeader}>
                    <Feather name="alert-circle" size={20} color="#F59E0B" />
                    <Text style={styles.alertTitle}>Commandes en attente</Text>
                  </View>
                  <Text style={styles.alertText}>
                    Vous avez {pendingOrders} commande{pendingOrders > 1 ? 's' : ''} en attente de traitement
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {todaysOrders.slice(0, 5).map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                    <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Feather name="user" size={14} color="#666" />
                    <Text style={styles.orderCustomer}>
                      {order.User?.firstName} {order.User?.lastName}
                    </Text>
                  </View>
                  <View style={styles.orderFooter}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: order.status === 'pending' ? '#FEF3C7' : '#D1FAE5' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: order.status === 'pending' ? '#D97706' : '#047857' }
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                    <Text style={styles.orderTime}>
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                </View>
              ))}
              {todaysOrders.length === 0 && (
                <View style={styles.emptyState}>
                  <Feather name="inbox" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>Aucune commande aujourd'hui</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF5733',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FF5733',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#D97706',
  },
  alertText: {
    color: '#92400E',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCustomer: {
    marginLeft: 6,
    color: '#6B7280',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
});