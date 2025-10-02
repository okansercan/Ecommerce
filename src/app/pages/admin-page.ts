import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Product, ProductType } from '../services/product';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Admin Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ authService.user()?.username }}</span>
            <button (click)="authService.logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <div class="p-6">
        <!-- Action Buttons -->
        <div class="mb-6 flex space-x-4">
          <button 
            (click)="currentView = 'list'"
            [class]="currentView === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="px-6 py-2 rounded-lg border border-gray-300 transition-colors">
            Ürünleri Listele
          </button>
          <button 
            (click)="currentView = 'add'"
            [class]="currentView === 'add' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="px-6 py-2 rounded-lg border border-gray-300 transition-colors">
            Yeni Ürün Ekle
          </button>
        </div>

        <!-- Product List View -->
        <div *ngIf="currentView === 'list'">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Ürün Listesi</h2>
            </div>
            
            <!-- Loading State -->
            <div *ngIf="isLoading" class="p-8 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="text-gray-500 mt-2">Ürünler yükleniyor...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="errorMessage" class="p-6 bg-red-50 border-l-4 border-red-400">
              <p class="text-red-700">{{ errorMessage }}</p>
              <button (click)="loadProducts()" class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Tekrar Dene
              </button>
            </div>

            <!-- Products Table -->
            <div *ngIf="!isLoading && !errorMessage" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let product of products" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img [src]="product.image" [alt]="product.title" class="h-12 w-12 rounded-lg object-contain bg-gray-100 p-1">
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 max-w-xs truncate">{{ product.title }}</div>
                          <div class="text-sm text-gray-500 max-w-xs truncate">{{ product.description }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {{ product.category }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      \${{ product.price }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex items-center">
                        <span class="text-yellow-400">★</span>
                        <span class="ml-1">{{ product.rating.rate }} ({{ product.rating.count }})</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Add New Product View -->
        <div *ngIf="currentView === 'add'">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Yeni Ürün Ekle</h2>
            
            <form [formGroup]="productForm" (ngSubmit)="addProduct()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Product Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                  <input 
                    formControlName="title"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ürün adını girin">
                  <div *ngIf="productForm.get('title')?.invalid && productForm.get('title')?.touched" class="text-red-500 text-sm mt-1">
                    Ürün adı gereklidir
                  </div>
                </div>

                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
                  <input 
                    formControlName="price"
                    type="number" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00">
                  <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="text-red-500 text-sm mt-1">
                    Geçerli bir fiyat girin
                  </div>
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select 
                    formControlName="category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Kategori seçin</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                  </select>
                  <div *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched" class="text-red-500 text-sm mt-1">
                    Kategori seçin
                  </div>
                </div>

                <!-- Image URL -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Resim URL</label>
                  <input 
                    formControlName="image"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg">
                  <div *ngIf="productForm.get('image')?.invalid && productForm.get('image')?.touched" class="text-red-500 text-sm mt-1">
                    Geçerli bir URL girin
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea 
                  formControlName="description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ürün açıklamasını girin"></textarea>
                <div *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched" class="text-red-500 text-sm mt-1">
                  Açıklama gereklidir
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end space-x-4">
                <button 
                  type="button"
                  (click)="resetForm()"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Temizle
                </button>
                <button 
                  type="submit"
                  [disabled]="productForm.invalid || isSubmitting"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Ekleniyor...' : 'Ürün Ekle' }}
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class AdminPage implements OnInit {
  currentView: 'list' | 'add' = 'list';
  products: ProductType[] = [];
  isLoading = false;
  errorMessage = '';
  isSubmitting = false;
  successMessage = '';

  productForm: FormGroup;

  constructor(
    public authService: AuthService,
    private productService: Product,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.productService.list().pipe(
      catchError((error) => {
        console.error('Product list error:', error);
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu';
        this.isLoading = false;
        return of([]);
      })
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      }
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      this.successMessage = '';

      // Simulate API call (since we don't have a real POST endpoint)
      setTimeout(() => {
        const newProduct: ProductType = {
          id: Date.now(), // Generate a temporary ID
          ...this.productForm.value,
          rating: {
            rate: 0,
            count: 0
          }
        };

        // Add to local array (in real app, this would be an API call)
        this.products.unshift(newProduct);
        
        this.isSubmitting = false;
        this.successMessage = 'Ürün başarıyla eklendi!';
        this.resetForm();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }

  resetForm() {
    this.productForm.reset();
    this.successMessage = '';
  }
}