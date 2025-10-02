import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, ProductType, CategoryType } from '../services/product';
import { CartStore } from '../services/cart.store';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html',
  styles: [`
    /* Custom styles for Beymen-inspired design */
    section {
      scroll-snap-align: start;
    }
    
    .tracking-wide {
      letter-spacing: 0.1em;
    }
    
    .tracking-widest {
      letter-spacing: 0.25em;
    }
    
    /* Smooth scrolling for full-page sections */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom hover effects */
    .group:hover .group-hover\\:scale-105 {
      transform: scale(1.05);
    }
    
    /* Typography enhancements */
    h1, h2, h3 {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Gradient text effects */
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Full width layout */
    .container-full {
      width: 100%;
      max-width: none;
    }

    /* Line clamp utility */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Aspect ratio utilities */
    .aspect-square {
      aspect-ratio: 1 / 1;
    }

    .aspect-\\[3\\/4\\] {
      aspect-ratio: 3 / 4;
    }

    /* Custom animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Responsive utilities */
    @media (max-width: 768px) {
      .text-responsive {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
      }
    }
  `]
})
export class HomePage implements OnInit {
  productService = inject(Product);
  cartStore = inject(CartStore);
  
  categories$!: Observable<CategoryType[]>;
  featuredProducts$!: Observable<ProductType[]>;
  productsByCategory$!: Observable<{[key: string]: ProductType[]}>;
  trendingProducts$!: Observable<ProductType[]>;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    // Load categories
    this.categories$ = this.productService.getCategories();
    
    // Load all products and organize by categories
    this.productsByCategory$ = this.productService.list().pipe(
      map(products => {
        const grouped: {[key: string]: ProductType[]} = {};
        products.forEach(product => {
          if (!grouped[product.category]) {
            grouped[product.category] = [];
          }
          grouped[product.category].push(product);
        });
        return grouped;
      })
    );

    // Load featured products (first 8 products)
    this.featuredProducts$ = this.productService.list().pipe(
      map(products => products.slice(0, 8))
    );

    // Load trending products (highest rated products)
    this.trendingProducts$ = this.productService.list().pipe(
      map(products => 
        products
          .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, 6)
      )
    );
  }

  addToCart(product: ProductType) {
    this.cartStore.addToCart(product);
  }

  getCategoryDisplayName(category: string): string {
    const categoryNames: {[key: string]: string} = {
      "men's clothing": "ERKEK GİYİM",
      "women's clothing": "KADIN GİYİM",
      "jewelery": "MÜCEVHER",
      "electronics": "ELEKTRONİK"
    };
    return categoryNames[category] || category.toUpperCase();
  }

  getCategoryDescription(category: string): string {
    const descriptions: {[key: string]: string} = {
      "men's clothing": "Erkekler için şık ve modern kıyafetler",
      "women's clothing": "Kadınlar için zarif ve trendy parçalar", 
      "jewelery": "Özel günler için mücevher koleksiyonu",
      "electronics": "En son teknoloji ürünleri"
    };
    return descriptions[category] || "Özel koleksiyon";
  }
}