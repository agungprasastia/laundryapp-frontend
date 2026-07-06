import { Routes } from '@angular/router';
import { authGuard, adminGuard, pelangganGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'pakets',
    loadComponent: () => import('./features/public/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'cek-status',
    loadComponent: () => import('./features/public/cek-status.component').then(m => m.CekStatusComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'user',
    canActivate: [pelangganGuard],
    loadComponent: () => import('./features/user/dashboard.component').then(m => m.UserDashboardComponent),
  },
  {
    path: 'user/pesan',
    canActivate: [pelangganGuard],
    loadComponent: () => import('./features/user/pesan.component').then(m => m.PesanComponent),
  },
  {
    path: 'user/pesanan/:id',
    canActivate: [pelangganGuard],
    loadComponent: () => import('./features/user/pesanan-detail.component').then(m => m.PesananDetailComponent),
  },
  {
    path: 'user/bayar/:id',
    canActivate: [pelangganGuard],
    loadComponent: () => import('./features/user/bayar.component').then(m => m.BayarComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'admin/pakets',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/pakets.component').then(m => m.AdminPaketsComponent),
  },
  {
    path: 'admin/pesanan',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/pesanan.component').then(m => m.AdminPesananComponent),
  },
  {
    path: 'admin/laporan',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/laporan.component').then(m => m.AdminLaporanComponent),
  },
  { path: '**', redirectTo: '' },
];
