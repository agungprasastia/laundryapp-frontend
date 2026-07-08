import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside [class.translate-x-0]="sidebarOpen" [class.-translate-x-full]="!sidebarOpen"
             class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col text-slate-300">
        
        <!-- Sidebar Header -->
        <div class="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <a routerLink="/admin" class="flex items-center gap-3 text-white no-underline group">
            <span class="bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-900 w-8 h-8 flex items-center justify-center font-serif text-lg italic rounded-lg shadow-md group-hover:shadow-emerald-500/30 group-hover:-translate-y-0.5 transition-all duration-300">K</span>
            <span class="font-serif font-bold text-xl tracking-tight">Admin<span class="text-emerald-400">Panel</span></span>
          </a>
          <button class="md:hidden text-slate-400 hover:text-white" (click)="sidebarOpen = false">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-4">Menu Utama</div>
          <a routerLink="/admin" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">dashboard</span> Dashboard
          </a>
          <a routerLink="/admin/pesanan" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">receipt_long</span> Kelola Pesanan
          </a>
          
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-4 mt-6">Master Data</div>
          <a routerLink="/admin/pakets" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">local_laundry_service</span> Layanan Paket
          </a>
          <a routerLink="/admin/pelanggan" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">groups</span> Data Pelanggan
          </a>
          <a routerLink="/admin/ulasan" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">star</span> Ulasan Pelanggan
          </a>

          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-4 mt-6">Analitik</div>
          <a routerLink="/admin/laporan" routerLinkActive="bg-emerald-500/10 text-emerald-400 font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            <span class="material-icons">insights</span> Laporan Keuangan
          </a>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-800">
          <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-colors">
            <span class="material-icons text-[18px]">logout</span> Keluar Sistem
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- Topbar -->
        <header class="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm flex items-center justify-between px-6 z-30 sticky top-0">
          <button class="md:hidden text-slate-500 hover:text-emerald-600 transition-colors flex items-center" (click)="sidebarOpen = true">
            <span class="material-icons text-2xl">menu</span>
          </button>
          
          <div class="flex-1"></div> <!-- Spacer -->

          <div class="flex items-center gap-4 relative">
            <a routerLink="/" class="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 hidden sm:flex">
              <span class="material-icons text-[18px]">public</span> Kunjungi Web
            </a>
            <div class="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <!-- Profile Button -->
            <button (click)="profileMenuOpen = !profileMenuOpen" class="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-left focus:outline-none">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-slate-800 leading-tight">
                  <ng-container *ngIf="profile; else loadingName">{{ profile.full_name }}</ng-container>
                  <ng-template #loadingName><span class="animate-pulse bg-slate-200 h-4 w-20 inline-block rounded"></span></ng-template>
                </p>
                <p class="text-xs text-slate-500">Administrator</p>
              </div>
              <div *ngIf="!profile?.avatar_url" class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                <span *ngIf="!profile" class="material-icons text-xl">admin_panel_settings</span>
                <span *ngIf="profile">{{ getInitials() }}</span>
              </div>
              <img *ngIf="profile?.avatar_url" [src]="profile.avatar_url" class="w-10 h-10 rounded-full object-cover border border-emerald-200" />
              <span class="material-icons text-slate-400 text-sm transition-transform duration-200" [class.rotate-180]="profileMenuOpen">expand_more</span>
            </button>

            <!-- Profile Dropdown Menu -->
            <div *ngIf="profileMenuOpen" class="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-up origin-top-right">
              <div class="px-4 py-3 border-b border-slate-100 mb-2 sm:hidden">
                <p class="text-sm font-bold text-slate-800">{{ profile?.full_name || 'Memuat...' }}</p>
                <p class="text-xs text-slate-500">Administrator</p>
              </div>
              <a routerLink="/admin/profil" (click)="profileMenuOpen = false" class="w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                <span class="material-icons text-[18px]">account_circle</span> Profil Saya
              </a>
            </div>
            
            <!-- Transparent overlay to close dropdown -->
            <div *ngIf="profileMenuOpen" (click)="profileMenuOpen = false" class="fixed inset-0 z-40"></div>
          </div>
        </header>


        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-slate-50">
          <router-outlet></router-outlet>
        </main>

      </div>
      
      <!-- Overlay for mobile sidebar -->
      <div *ngIf="sidebarOpen" (click)="sidebarOpen = false"
           class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn">
      </div>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = false;
  profileMenuOpen = false;
  profile: any = null;

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {
    this.router.events.subscribe(() => {
      // Close sidebar on navigation in mobile
      this.sidebarOpen = false;
      this.profileMenuOpen = false;
    });
  }

  ngOnInit() {
    this.auth.session$.subscribe(session => {
      if (session?.user?.user_metadata) {
        this.profile = { ...this.profile, ...session.user.user_metadata };
      }
    });
    this.api.profileState$.subscribe(profile => {
      if (profile) this.profile = { ...this.profile, ...profile };
    });
    this.api.getMe().subscribe(); // Triggers updateProfileState internally
  }

  getInitials(): string {
    if (!this.profile?.full_name) return 'A';
    const parts = this.profile.full_name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
