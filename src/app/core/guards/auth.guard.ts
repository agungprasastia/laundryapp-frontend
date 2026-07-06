import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = (): Observable<boolean> | boolean => {
  const auth = inject(AuthService);
  const api = inject(ApiService);
  const router = inject(Router);
  
  if (!auth.token) { 
    router.navigate(['/login']); 
    return false; 
  }
  
  return api.getMe().pipe(
    map(profile => {
      if (profile.role !== 'admin') {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

export const pelangganGuard: CanActivateFn = (): Observable<boolean> | boolean => {
  const auth = inject(AuthService);
  const api = inject(ApiService);
  const router = inject(Router);
  
  if (!auth.token) { 
    router.navigate(['/login']); 
    return false; 
  }
  
  return api.getMe().pipe(
    map(profile => {
      if (profile.role !== 'pelanggan') {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
