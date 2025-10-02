import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap(event => {
      console.log('HTTP Response:', event);
    }),
    catchError(error => {
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};