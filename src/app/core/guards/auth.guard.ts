import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const api = inject(ApiService);
  const router = inject(Router);
  if (!auth.token) { router.navigate(['/login']); return false; }
  try {
    const profile = await firstValueFrom(api.getMe());
    if (profile.role !== 'admin') { router.navigate(['/']); return false; }
    return true;
  } catch {
    router.navigate(['/login']);
    return false;
  }
};

export const pelangganGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const api = inject(ApiService);
  const router = inject(Router);
  if (!auth.token) { router.navigate(['/login']); return false; }
  try {
    const profile = await firstValueFrom(api.getMe());
    if (profile.role !== 'pelanggan') { router.navigate(['/']); return false; }
    return true;
  } catch {
    router.navigate(['/login']);
    return false;
  }
};
