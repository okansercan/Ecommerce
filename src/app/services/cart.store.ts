import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';
import { ProductType } from './product';

export interface CartItem {
  product: ProductType;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    totalItems: computed(() => items().reduce((total, item) => total + item.quantity, 0)),
    totalPrice: computed(() => 
      items().reduce((total, item) => total + (item.product.price * item.quantity), 0)
    ),
    isEmpty: computed(() => items().length === 0)
  })),
  withMethods((store) => ({
    addToCart(product: ProductType) {
      const existingItem = store.items().find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Ürün zaten sepette varsa, miktarını artır
        const updatedItems = store.items().map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        patchState(store, { items: updatedItems });
      } else {
        // Yeni ürün ekle
        const newItem: CartItem = { product, quantity: 1 };
        patchState(store, { items: [...store.items(), newItem] });
      }
    },
    
    removeFromCart(productId: number) {
      const updatedItems = store.items().filter(item => item.product.id !== productId);
      patchState(store, { items: updatedItems });
    },
    
    updateQuantity(productId: number, quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      
      const updatedItems = store.items().map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      patchState(store, { items: updatedItems });
    },
    
    clearCart() {
      patchState(store, { items: [] });
    }
  }))
);