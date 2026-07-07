import { Routes } from '@angular/router';
import { authGuard, adminGuard, pelangganGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'pakets',
    loadComponent: () => import('./features/public/pakets.component').then(m => m.PaketsComponent),
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
    loadComponent: () => import('./layouts/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/user/dashboard.component').then(m => m.UserDashboardComponent),
      },
      {
        path: 'layanan',
        loadComponent: () => import('./features/user/layanan.component').then(m => m.UserLayananComponent),
      },
      {
        path: 'pesan',
        loadComponent: () => import('./features/user/pesan.component').then(m => m.PesanComponent),
      },
      {
        path: 'bantuan',
        loadComponent: () => import('./features/user/faq.component').then(m => m.UserFaqComponent),
      },
      {
        path: 'pesanan/:id',
        loadComponent: () => import('./features/user/pesanan-detail.component').then(m => m.PesananDetailComponent),
      },
      {
        path: 'bayar/:id',
        loadComponent: () => import('./features/user/bayar.component').then(m => m.BayarComponent),
      },
      {
        path: 'profil',
        loadComponent: () => import('./shared/components/profile.component').then(m => m.ProfileComponent),
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layouts/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'pakets',
        loadComponent: () => import('./features/admin/pakets.component').then(m => m.AdminPaketsComponent),
      },
      {
        path: 'pesanan',
        loadComponent: () => import('./features/admin/pesanan.component').then(m => m.AdminPesananComponent),
      },
      {
        path: 'laporan',
        loadComponent: () => import('./features/admin/laporan.component').then(m => m.AdminLaporanComponent),
      },
      {
        path: 'ulasan',
        loadComponent: () => import('./features/admin/ulasan.component').then(m => m.AdminUlasanComponent),
      },
      {
        path: 'pelanggan',
        loadComponent: () => import('./features/admin/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'profil',
        loadComponent: () => import('./shared/components/profile.component').then(m => m.ProfileComponent),
      }
    ]
  },
  { path: '**', redirectTo: '' },
];
