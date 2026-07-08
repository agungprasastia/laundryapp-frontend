import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside [class.translate-x-0]="sidebarOpen" [class.-translate-x-full]="!sidebarOpen"
             class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col">
        
        <!-- Sidebar Header -->
        <div class="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <a routerLink="/user" class="flex items-center gap-3 text-primary no-underline group">
            <span class="bg-gradient-to-br from-primary to-primary-600 text-white w-8 h-8 flex items-center justify-center font-serif text-lg italic rounded-lg shadow-md shadow-primary/30 group-hover:shadow-primary/50 group-hover:-translate-y-0.5 transition-all duration-300">K</span>
            <span class="font-serif font-bold text-xl tracking-tight text-slate-800">Pelanggan</span>
          </a>
          <button class="md:hidden text-slate-400 hover:text-slate-600" (click)="sidebarOpen = false">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <a routerLink="/user" routerLinkActive="bg-primary-50 text-primary font-bold" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span class="material-icons">dashboard</span> Dashboard
          </a>
          <a routerLink="/user/layanan" routerLinkActive="bg-primary-50 text-primary font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span class="material-icons">local_laundry_service</span> Daftar Layanan
          </a>
          <a routerLink="/user/pesan" routerLinkActive="bg-primary-50 text-primary font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span class="material-icons">add_circle</span> Buat Pesanan
          </a>
          
          <div class="h-px bg-slate-100 my-2 mx-4"></div>
          
          <a routerLink="/user/bantuan" routerLinkActive="bg-primary-50 text-primary font-bold"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span class="material-icons">help_outline</span> Pusat Bantuan
          </a>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-100">
          <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors">
            <span class="material-icons text-[18px]">logout</span> Keluar
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- Topbar -->
        <header class="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm flex items-center justify-between px-6 z-30 sticky top-0">
          <button class="md:hidden text-slate-500 hover:text-primary transition-colors flex items-center" (click)="sidebarOpen = true">
            <span class="material-icons text-2xl">menu</span>
          </button>
          
          <div class="flex-1"></div> <!-- Spacer -->

          <div class="flex items-center gap-4 relative">
            <a routerLink="/" class="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1 hidden sm:flex">
              <span class="material-icons text-[18px]">public</span> Web Publik
            </a>
            <div class="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <!-- Profile Button -->
            <button (click)="profileMenuOpen = !profileMenuOpen" class="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-left focus:outline-none">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-slate-800 leading-tight">
                  <ng-container *ngIf="profile; else loadingName">{{ profile.full_name }}</ng-container>
                  <ng-template #loadingName><span class="animate-pulse bg-slate-200 h-4 w-20 inline-block rounded"></span></ng-template>
                </p>
                <p class="text-xs text-slate-500">Pelanggan Setia</p>
              </div>
              <div *ngIf="!profile?.avatar_url" class="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold border border-primary-200">
                <span *ngIf="!profile" class="material-icons text-xl">person</span>
                <span *ngIf="profile">{{ getInitials() }}</span>
              </div>
              <img *ngIf="profile?.avatar_url" [src]="profile.avatar_url" class="w-10 h-10 rounded-full object-cover border border-primary-200" />
              <span class="material-icons text-slate-400 text-sm transition-transform duration-200" [class.rotate-180]="profileMenuOpen">expand_more</span>
            </button>

            <!-- Profile Dropdown Menu -->
            <div *ngIf="profileMenuOpen" class="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-up origin-top-right">
              <div class="px-4 py-3 border-b border-slate-100 mb-2 sm:hidden">
                <p class="text-sm font-bold text-slate-800">{{ profile?.full_name || 'Memuat...' }}</p>
                <p class="text-xs text-slate-500">Pelanggan Setia</p>
              </div>
              <a routerLink="/user/profil" (click)="profileMenuOpen = false" class="w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                <span class="material-icons text-[18px]">account_circle</span> Profil Saya
              </a>
            </div>
            
            <!-- Transparent overlay to close dropdown -->
            <div *ngIf="profileMenuOpen" (click)="profileMenuOpen = false" class="fixed inset-0 z-40"></div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>

      </div>
      
      <!-- Overlay for mobile sidebar -->
      <div *ngIf="sidebarOpen" (click)="sidebarOpen = false"
           class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn">
      </div>

      <!-- Floating WhatsApp Button -->
      <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Kinclong,%20saya%20butuh%20bantuan." target="_blank"
         class="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95 transition-all duration-300 z-50 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
        <!-- Tooltip -->
        <span class="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Hubungi Admin
        </span>
      </a>
    </div>
  `,
  styles: []
})
export class UserLayoutComponent implements OnInit {
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
    if (!this.profile?.full_name) return 'K';
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
