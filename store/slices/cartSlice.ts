import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Dish } from '../../types/dish';

interface CartItem {
  id: number;
  dish: Dish;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  deliveryFee: number;
  taxAmount: number;
  grandTotal: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  deliveryFee: 0,
  taxAmount: 0,
  grandTotal: 0,
};

const calculateTotals = (state: CartState) => {
  state.total = state.items.reduce((sum, item) => {
    return sum + parseFloat(item.dish.price) * item.quantity;
  }, 0);
  
  state.taxAmount = state.total * 0.1; // Assuming 10% tax
  state.grandTotal = state.total + state.deliveryFee + state.taxAmount;
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ dish: Dish; quantity: number }>) => {
      const { dish, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === dish.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: dish.id,
          dish,
          quantity,
        });
      }
      
      calculateTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
      }
      
      calculateTotals(state);
    },
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.taxAmount = 0;
      state.grandTotal = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setDeliveryFee, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectDeliveryFee = (state: RootState) => state.cart.deliveryFee;
export const selectTaxAmount = (state: RootState) => state.cart.taxAmount;
export const selectGrandTotal = (state: RootState) => state.cart.grandTotal;
export const selectCartItemCount = (state: RootState) => 
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;