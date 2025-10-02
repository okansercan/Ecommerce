import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../services/cart.store';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Cart Icon -->
      <button 
        (click)="toggleCart()"
        class="relative p-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 group">
        <!-- Shopping bag icon -->
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
        </svg>
        
        <!-- Item Count Badge -->
        @if (cartStore.totalItems() > 0) {
          <span class="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
            {{ cartStore.totalItems() }}
          </span>
        }
        
        <!-- Hover effect ring -->
        <div class="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gray-300 transition-all duration-300"></div>
      </button>

      <!-- Dropdown Cart -->
      @if (isOpen) {
        <div class="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] transform animate-in slide-in-from-top-2 duration-200">
          <!-- Cart Header -->
          <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
                </svg>
                <h3 class="text-xl font-bold text-gray-800">Sepetim</h3>
                @if (cartStore.totalItems() > 0) {
                  <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full font-medium">
                    {{ cartStore.totalItems() }} ürün
                  </span>
                }
              </div>
              <button 
                (click)="toggleCart()"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Cart Items -->
          <div class="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            @if (cartStore.isEmpty()) {
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
                  </svg>
                </div>
                <p class="text-gray-500 text-lg font-medium mb-2">Sepetiniz boş</p>
                <p class="text-gray-400 text-sm">Alışverişe başlamak için ürünleri sepete ekleyin</p>
              </div>
            } @else {
              <div class="p-4">
                @for (item of cartStore.items(); track item.product.id) {
                  <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 mb-3 bg-gradient-to-r from-white to-gray-50">
                    <div class="flex items-start space-x-4">
                      <!-- Product Image -->
                      <div class="flex-shrink-0">
                        <img 
                          [src]="item.product.image" 
                          [alt]="item.product.title"
                          class="w-16 h-16 object-contain bg-white rounded-lg border border-gray-200 shadow-sm">
                      </div>
                      
                      <!-- Product Info -->
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                          {{ item.product.title }}
                        </h4>
                        
                        <!-- Quantity Controls -->
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                            <button 
                              (click)="decreaseQuantity(item.product.id)"
                              class="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 hover:text-gray-800 hover:shadow-md transition-all duration-200 border border-gray-200">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                              </svg>
                            </button>
                            <span class="text-sm font-bold text-gray-800 w-8 text-center">{{ item.quantity }}</span>
                            <button 
                              (click)="increaseQuantity(item.product.id)"
                              class="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 hover:text-gray-800 hover:shadow-md transition-all duration-200 border border-gray-200">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                            </button>
                          </div>
                          
                          <button 
                            (click)="removeItem(item.product.id)"
                            class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <!-- Price -->
                        <div class="mt-2 flex items-center justify-between">
                          <span class="text-lg font-bold text-gray-900">
                            \${{ (item.product.price * item.quantity).toFixed(2) }}
                          </span>
                          <span class="text-sm text-gray-500">
                            \${{ item.product.price }} × {{ item.quantity }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Cart Footer -->
          @if (!cartStore.isEmpty()) {
            <div class="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
              <!-- Total -->
              <div class="flex items-center justify-between mb-4 p-3 bg-white rounded-xl border border-gray-100">
                <span class="text-lg font-semibold text-gray-700">Toplam Tutar:</span>
                <span class="text-2xl font-bold text-green-600">
                  \${{ cartStore.totalPrice().toFixed(2) }}
                </span>
              </div>
              
              <!-- Action Buttons -->
              <div class="space-y-3">
                <button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8-9m0 0h15.4M7 13h10"></path>
                    </svg>
                    <span>Sepete Git</span>
                  </div>
                </button>
                
                <button 
                  (click)="clearCart()"
                  class="w-full bg-gray-200 text-gray-700 py-2.5 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 border border-gray-200">
                  Sepeti Temizle
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Backdrop -->
    @if (isOpen) {
      <div 
        class="fixed inset-0 bg-black bg-opacity-20 z-[45] backdrop-blur-sm transition-all duration-200"
        (click)="toggleCart()">
      </div>
    }
  `,
  styles: [`
    .scrollbar-thin {
      scrollbar-width: thin;
    }
    .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
      background-color: #d1d5db;
      border-radius: 6px;
    }
    .scrollbar-track-gray-100::-webkit-scrollbar-track {
      background-color: #f3f4f6;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    @keyframes animate-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-in {
      animation: animate-in 0.2s ease-out;
    }
  `]
})
export class MiniCartComponent {
  cartStore = inject(CartStore);
  isOpen = false;

  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  increaseQuantity(productId: number) {
    const item = this.cartStore.items().find(item => item.product.id === productId);
    if (item) {
      this.cartStore.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartStore.items().find(item => item.product.id === productId);
    if (item) {
      this.cartStore.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    this.cartStore.removeFromCart(productId);
  }

  clearCart() {
    this.cartStore.clearCart();
    this.isOpen = false;
  }
}