import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Product, ProductType } from '../services/product';
import { CartStore } from '../services/cart.store';
import { Subject, startWith, debounceTime, distinctUntilChanged, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

interface FilterForm {
  search: FormControl<string>;
  category: FormControl<string>;
  minPrice: FormControl<number | null>;
  maxPrice: FormControl<number | null>;
  sortBy: FormControl<string>;
}

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-center mb-8">Öne Çıkan Ürünler</h2>
      
      <!-- Error Message -->
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <div class="flex items-center justify-between">
          <span>{{ errorMessage }}</span>
          <button (click)="dismissError()" class="text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <button 
          *ngIf="canRetry"
          (click)="retryLoad()"
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Tekrar Dene
        </button>
      </div>

      <!-- Filter Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input 
              formControlName="search" 
              type="text" 
              placeholder="Ürün ara..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select formControlName="category" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tüm Kategoriler</option>
              <option *ngFor="let category of categories" [value]="category">{{ category | titlecase }}</option>
            </select>
          </div>
          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
            <select formControlName="sortBy" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="title-asc">İsim (A-Z)</option>
              <option value="title-desc">İsim (Z-A)</option>
              <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
              <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
            </select>
          </div>
          <!-- Price Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
            <div class="grid grid-cols-2 gap-2">
              <input 
                formControlName="minPrice" 
                type="number" 
                placeholder="Min"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <input 
                formControlName="maxPrice" 
                type="number" 
                placeholder="Max"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </form>
        
        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button 
            type="button"
            (click)="clearFilters()"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Filtreleri Temizle
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6" *ngIf="filteredProducts$ | async as products">
        <p class="text-gray-600">{{ products.length }} ürün bulundu</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 text-lg mt-4">Yükleniyor...</p>
      </div>

      <!-- Product Grid -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of filteredProducts$ | async" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          
          <!-- Product Image -->
          <div class="relative">
            <img 
              [src]="product.image" 
              [alt]="product.title"
              class="w-full h-48 object-contain bg-white p-4">
          </div>
          
          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.title }}</h3>
            <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
            
            <!-- Rating and Category -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <span class="text-yellow-400">★</span>
                <span class="text-sm text-gray-600 ml-1">{{ product.rating.rate }} ({{ product.rating.count }})</span>
              </div>
              <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">{{ product.category }}</span>
            </div>
            
            <!-- Price -->
            <div class="mb-3">
              <span class="text-2xl font-bold text-blue-600">\${{ product.price }}</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-2">
              <a 
                [routerLink]="['/products', product.id]"
                class="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors">
                Detayları Gör
              </a>
              <button 
                (click)="addToCart(product)"
                class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8-9m0 0h15.4M7 13h10"></path>
                </svg>
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!isLoading && (filteredProducts$ | async)?.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cartStore = inject(CartStore);
  
  products: ProductType[] = [];
  filteredProducts$: Observable<ProductType[]>;
  categories: string[] = [];
  
  // Error handling properties
  errorMessage: string = '';
  isLoading: boolean = false;
  canRetry: boolean = false;

  filterForm = new FormGroup<FilterForm>({
    search: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    sortBy: new FormControl('title-asc', { nonNullable: true })
  });

  constructor(
    private productService: Product,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filteredProducts$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map(() => this.applyFilters())
    );
  }

  ngOnInit() {
    this.loadData();
    this.loadFiltersFromUrl();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.isLoading = true;
    this.errorMessage = '';
    this.canRetry = false;

    // Load products with error handling
    this.productService.list().pipe(
      takeUntil(this.destroy$),
      catchError((error: any) => {
        console.error('Product list error:', error);
        this.errorMessage = error.userMessage || 'Ürünler yüklenirken bir hata oluştu';
        this.canRetry = true;
        this.isLoading = false;
        return of([]); // Fallback to empty array
      })
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        if (products.length === 0 && !this.errorMessage) {
          this.errorMessage = 'Henüz ürün bulunmuyor';
        }
      },
      error: (error) => {
        console.error('Unexpected error:', error);
        this.errorMessage = 'Beklenmedik bir hata oluştu';
        this.canRetry = true;
        this.isLoading = false;
      }
    });

    // Load categories with error handling
    this.productService.getCategories().pipe(
      takeUntil(this.destroy$),
      catchError((error: any) => {
        console.error('Categories error:', error);
        // Don't show error for categories, just use empty array
        return of([]);
      })
    ).subscribe({
      next: (categoryData) => {
        this.categories = categoryData.map(cat => cat.name);
      }
    });
  }

  retryLoad() {
    this.loadData();
  }

  dismissError() {
    this.errorMessage = '';
    this.canRetry = false;
  }

  private loadFiltersFromUrl() {
    const params = this.route.snapshot.queryParams;
    
    this.filterForm.patchValue({
      search: params['search'] || '',
      category: params['category'] || '',
      minPrice: params['minPrice'] ? +params['minPrice'] : null,
      maxPrice: params['maxPrice'] ? +params['maxPrice'] : null,
      sortBy: params['sortBy'] || 'title-asc'
    }, { emitEvent: false });
  }

  private applyFilters(): ProductType[] {
    let filtered = [...this.products];
    const formValue = this.filterForm.value;

    // Search filter
    if (formValue.search?.trim()) {
      const searchTerm = formValue.search.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (formValue.category) {
      filtered = filtered.filter(product => product.category === formValue.category);
    }

    // Price range filter
    if (formValue.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= formValue.minPrice!);
    }
    if (formValue.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= formValue.maxPrice!);
    }

    // Sorting
    const [sortField, sortDirection] = (formValue.sortBy || 'title-asc').split('-');
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title, 'tr');
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    this.updateUrl();
    return filtered;
  }

  private updateUrl() {
    const formValue = this.filterForm.value;
    const queryParams: any = {};

    // Only add non-empty values to URL
    if (formValue.search?.trim()) queryParams.search = formValue.search;
    if (formValue.category) queryParams.category = formValue.category;
    if (formValue.minPrice !== null) queryParams.minPrice = formValue.minPrice;
    if (formValue.maxPrice !== null) queryParams.maxPrice = formValue.maxPrice;
    if (formValue.sortBy !== 'title-asc') queryParams.sortBy = formValue.sortBy;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  clearFilters() {
    this.filterForm.reset({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      sortBy: 'title-asc'
    });
  }

  addToCart(product: ProductType) {
    this.cartStore.addToCart(product);
    // Kısa bir süreliğine başarı göstergesi gösterebiliriz
    // Bu isteğe bağlı, basit bir implementation için skip edebiliriz
  }
}