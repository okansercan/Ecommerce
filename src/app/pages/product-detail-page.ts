import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductType } from '../services/product';
import { CartStore } from '../services/cart.store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'product-detail-page.html',
  styleUrls: ['product-detail-page.scss']
})
export class ProductDetailPage implements OnInit {
  id: string | null;
  showDetails = false;
  productDetails$: Observable<ProductType> | null = null;
  cartStore = inject(CartStore);

  constructor(private route: ActivatedRoute, private productService: Product) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.id) {
      this.loadProductDetails();
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  addToCart(product: ProductType) {
    this.cartStore.addToCart(product);
  }

  private loadProductDetails() {
    if (this.id) {
      this.productDetails$ = this.productService.getById(parseInt(this.id));
    }
  }
}