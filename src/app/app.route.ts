import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-page').then((m) => m.AdminPage),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail-page').then((m) => m.ProductDetailPage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
