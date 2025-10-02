import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  // Request interceptor - headers, authentication vs eklenebilir
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json'
    }
  });

  console.log('HTTP Request:', modifiedReq.url);
  return next(modifiedReq);
};