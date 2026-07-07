import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300" *ngIf="showNav">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-3 text-primary no-underline group">
          <span class="bg-gradient-to-br from-primary to-primary-600 text-white w-10 h-10 flex items-center justify-center font-serif text-2xl italic rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:-translate-y-0.5 transition-all duration-300">K</span>
          <span class="font-serif font-bold text-2xl tracking-tight text-slate-800">Kinclong</span>
        </a>
        
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-primary after:w-full" [routerLinkActiveOptions]="{exact:true}" 
             class="text-slate-500 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full">Beranda</a>
          <a routerLink="/pakets" routerLinkActive="text-primary after:w-full" 
             class="text-slate-500 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full">Layanan</a>
          <a routerLink="/cek-status" routerLinkActive="text-primary after:w-full" 
             class="text-slate-500 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full">Lacak</a>

          <ng-container *ngIf="!loggedIn">
            <div class="flex items-center gap-4 ml-4 pl-6 border-l border-slate-200">
              <a routerLink="/login" class="font-medium text-sm text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">Masuk</a>
              <a routerLink="/register" class="btn btn-primary py-2.5 px-6 text-sm shadow-lg shadow-primary/20 rounded-xl">Daftar Sekarang</a>
            </div>
          </ng-container>

          <ng-container *ngIf="loggedIn">
            <a *ngIf="role === 'pelanggan'" routerLink="/user" routerLinkActive="text-primary after:w-full"
               class="text-slate-500 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:text-primary hover:after:w-full">Dashboard</a>
            <a *ngIf="role === 'admin'" routerLink="/admin" routerLinkActive="text-primary after:w-full"
               class="text-slate-500 font-medium text-sm tracking-wide relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:text-primary hover:after:w-full">Panel Admin</a>
            <button (click)="logout()" class="font-medium text-sm text-slate-500 hover:text-red-500 transition-colors ml-4 pl-6 border-l border-slate-200 flex items-center gap-1"><span class="material-icons text-[18px]">logout</span> Keluar</button>
          </ng-container>
        </div>

        <button class="md:hidden text-slate-500 hover:text-primary p-2 focus:outline-none transition-colors" (click)="menuOpen = !menuOpen">
          <span class="material-icons text-3xl">{{ menuOpen ? 'close' : 'menu_open' }}</span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen" class="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl py-6 px-6 flex flex-col gap-6 animate-slideInUp z-40">
        <a routerLink="/" routerLinkActive="text-primary font-bold bg-primary/5" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl transition-all">Beranda</a>
        <a routerLink="/pakets" routerLinkActive="text-primary font-bold bg-primary/5" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl transition-all">Layanan</a>
        <a routerLink="/cek-status" routerLinkActive="text-primary font-bold bg-primary/5" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl transition-all">Lacak Pesanan</a>
        
        <div class="h-px w-full bg-slate-100 my-1"></div>
        
        <ng-container *ngIf="!loggedIn">
          <a routerLink="/login" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl text-center border border-slate-200">Masuk</a>
          <a routerLink="/register" (click)="menuOpen = false" class="btn btn-primary w-full text-center mt-2 rounded-xl">Daftar Sekarang</a>
        </ng-container>
        <ng-container *ngIf="loggedIn">
          <a *ngIf="role === 'pelanggan'" routerLink="/user" routerLinkActive="text-primary font-bold bg-primary/5" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl">Dashboard Akun</a>
          <a *ngIf="role === 'admin'" routerLink="/admin" routerLinkActive="text-primary font-bold bg-primary/5" (click)="menuOpen = false" class="text-slate-600 font-medium tracking-wide p-3 rounded-xl">Panel Admin</a>
          <button (click)="logout(); menuOpen = false" class="text-center text-red-500 font-medium tracking-wide p-3 rounded-xl bg-red-50 mt-2">Keluar Akun</button>
        </ng-container>
      </div>
    </nav>

    <main [class.min-h-[calc(100vh-80px)]]="showNav" class="w-full overflow-x-hidden">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-slate-900 border-t border-slate-800 pt-24 pb-12 mt-20" *ngIf="showNav">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12 mb-16 relative">
        <!-- Decorative Glow -->
        <div class="absolute -top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="md:col-span-5 lg:col-span-4 relative z-10">
          <div class="flex items-center gap-3 text-white mb-6">
            <span class="bg-gradient-to-br from-primary to-primary-600 text-white w-10 h-10 flex items-center justify-center font-serif text-xl italic rounded-xl shadow-lg">K</span>
            <span class="font-serif font-bold text-2xl">Kinclong</span>
          </div>
          <p class="text-slate-400 leading-relaxed text-sm mb-8 pr-4">Kami meredefinisi standar kebersihan dengan teknologi pencucian mutakhir, deterjen ramah lingkungan, dan layanan tepat waktu.</p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
              <span class="material-icons text-[20px]">facebook</span>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
              <span class="material-icons text-[20px]">photo_camera</span>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
              <span class="material-icons text-[20px]">chat</span>
            </a>
          </div>
        </div>
        
        <div class="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 relative z-10">
          <div>
            <h4 class="font-sans font-semibold text-xs uppercase tracking-widest text-slate-300 mb-6">Layanan</h4>
            <div class="flex flex-col gap-4">
              <a routerLink="/pakets" class="text-slate-400 text-sm hover:text-primary transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Cuci Kiloan</a>
              <a routerLink="/pakets" class="text-slate-400 text-sm hover:text-primary transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Cuci Satuan</a>
              <a routerLink="/pakets" class="text-slate-400 text-sm hover:text-primary transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Cuci Sepatu</a>
              <a routerLink="/pakets" class="text-slate-400 text-sm hover:text-primary transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Karpet & Bedcover</a>
            </div>
          </div>
          <div>
            <h4 class="font-sans font-semibold text-xs uppercase tracking-widest text-slate-300 mb-6">Perusahaan</h4>
            <div class="flex flex-col gap-4">
              <a href="#" class="text-slate-400 text-sm hover:text-primary transition-colors">Tentang Kami</a>
              <a href="#" class="text-slate-400 text-sm hover:text-primary transition-colors">Karier</a>
              <a href="#" class="text-slate-400 text-sm hover:text-primary transition-colors">Syarat & Ketentuan</a>
              <a href="#" class="text-slate-400 text-sm hover:text-primary transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <h4 class="font-sans font-semibold text-xs uppercase tracking-widest text-slate-300 mb-6">Hubungi Kami</h4>
            <div class="flex flex-col gap-4">
              <div class="flex items-start gap-3 text-slate-400 text-sm">
                <span class="material-icons text-[18px] text-primary mt-0.5">location_on</span>
                <p>Jl. Bersih Indah No.123,<br/>Jakarta Selatan 12345</p>
              </div>
              <div class="flex items-center gap-3 text-slate-400 text-sm">
                <span class="material-icons text-[18px] text-primary">phone</span>
                <p>(021) 555-0123</p>
              </div>
              <div class="flex items-center gap-3 text-slate-400 text-sm">
                <span class="material-icons text-[18px] text-primary">email</span>
                <p>halo&#64;kinclong.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p class="text-slate-500 text-sm">&copy; 2026 Kinclong Laundry. All rights reserved.</p>
        <p class="text-slate-500 text-sm flex items-center gap-1">Crafted with <span class="material-icons text-red-500 text-[16px]">favorite</span> for perfection.</p>
      </div>
    </footer>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  loggedIn = false;
  role = '';
  menuOpen = false;
  showNav = true;

  constructor(private auth: AuthService, private api: ApiService, private router: Router, private zone: NgZone) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide nav if user is in admin or user dashboard
      this.showNav = !(event.urlAfterRedirects.startsWith('/admin') || event.urlAfterRedirects.startsWith('/user'));
    });
  }

  ngOnInit() {
    this.auth.session$.subscribe(session => {
      this.loggedIn = !!session;
      if (session) {
        this.api.getMe().subscribe({
          next: p => this.role = p.role,
          error: () => this.role = '',
        });
      } else {
        this.role = '';
      }
    });
  }

  async logout() {
    await this.auth.signOut();
    this.zone.run(() => {
      this.router.navigate(['/']);
    });
  }
}
