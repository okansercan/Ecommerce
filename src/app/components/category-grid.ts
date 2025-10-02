import { Component, OnInit } from '@angular/core';
import { Product, CategoryType } from '../services/product';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="categories-section py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Kategoriler</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            *ngFor="let category of categories$ | async" 
            class="category-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="aspect-square">
              <img 
                [src]="category.image" 
                [alt]="category.name"
                class="w-full h-full object-cover"
              >
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800 capitalize">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-card:hover {
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
  `]
})
export class CategoryGridComponent implements OnInit {
  categories$: Observable<CategoryType[]>;

  constructor(private productService: Product) {
    this.categories$ = this.productService.getCategories();
  }

  ngOnInit() {}
}