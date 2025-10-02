import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, map, retry, timer, throwError } from 'rxjs';

export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CategoryType {
  name: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class Product {
  private baseUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  list(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.baseUrl}/products`).pipe(
      retry({
        count: 3,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          console.log(`Retry attempt ${retryCount} for error:`, error.status);
          if (error.status === 404 || error.status === 500 || error.status === 0) {
            return timer(500);
          }
          return throwError(() => error);
        }
      })
    );
  }

  getById(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.baseUrl}/products/${id}`).pipe(
      retry({
        count: 3,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          console.log(`Retry attempt ${retryCount} for error:`, error.status);
          if (error.status === 404 || error.status === 500 || error.status === 0) {
            return timer(1000);
          }
          return throwError(() => error);
        }
      })
    );
  }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/categories`).pipe(
      retry({
        count: 3,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          console.log(`Retry attempt ${retryCount} for error:`, error.status);
          if (error.status === 404 || error.status === 500 || error.status === 0) {
            return timer(1000);
          }
          return throwError(() => error);
        }
      }),
      map(categories => categories.map(category => ({
        name: category,
        image: this.getCategoryImage(category)
      })))
    );
  }

  uploadProductCatalog(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('catalog', file);
    
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      retry({
        count: 2,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          console.log(`Upload retry attempt ${retryCount} for error:`, error.status);
          if (error.status === 413 || error.status === 415) {
            // File too large or unsupported media type - don't retry
            return throwError(() => error);
          }
          if (error.status === 0 || error.status >= 500) {
            return timer(1000);
          }
          return throwError(() => error);
        }
      })
    );
  }

  private getCategoryImage(category: string): string {
    const categoryImages: { [key: string]: string } = {
      "men's clothing": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "women's clothing": "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "electronics": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };
    
    return categoryImages[category] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }
}
