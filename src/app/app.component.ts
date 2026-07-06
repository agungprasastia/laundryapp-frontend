import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="showNav">
      <a routerLink="/" class="logo">
        <span class="material-icons">local_laundry_service</span>
        <span class="logo-text">Kinclong</span>
      </a>
      <div class="nav-links" [class.open]="menuOpen">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Beranda</a>
        <a routerLink="/pakets" routerLinkActive="active">Paket</a>
        <a routerLink="/cek-status" routerLinkActive="active">Cek Status</a>

        <ng-container *ngIf="!loggedIn">
          <a routerLink="/login" class="nav-btn outline">Masuk</a>
          <a routerLink="/register" class="nav-btn primary">Daftar</a>
        </ng-container>

        <ng-container *ngIf="loggedIn">
          <a *ngIf="role === 'pelanggan'" routerLink="/user" routerLinkActive="active">Dashboard</a>
          <a *ngIf="role === 'admin'" routerLink="/admin" routerLinkActive="active">Admin</a>
          <button (click)="logout()" class="nav-btn outline">Keluar</button>
        </ng-container>
      </div>
      <button class="hamburger" (click)="menuOpen = !menuOpen">
        <span class="material-icons">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5vw; height: 64px; background: white;
      border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 50;
    }
    .logo {
      display: flex; align-items: center; gap: 8px; text-decoration: none; color: #0f172a;
      font-weight: 800; font-size: 20px;
    }
    .logo .material-icons { color: #0d9488; font-size: 28px; }
    .nav-links { display: flex; align-items: center; gap: 24px; }
    .nav-links a {
      text-decoration: none; color: #64748b; font-weight: 500; font-size: 14px;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #0d9488; }
    .nav-btn {
      padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600;
      text-decoration: none; cursor: pointer; border: none; transition: all 0.2s;
    }
    .nav-btn.primary { background: #0d9488; color: white; }
    .nav-btn.primary:hover { background: #0f766e; }
    .nav-btn.outline { border: 2px solid #e2e8f0; color: #64748b; background: white; }
    .nav-btn.outline:hover { border-color: #0d9488; color: #0d9488; }
    .hamburger {
      display: none; background: none; border: none; cursor: pointer; color: #0f172a;
    }
    @media (max-width: 768px) {
      .hamburger { display: block; }
      .nav-links {
        display: none; position: absolute; top: 64px; left: 0; right: 0;
        background: white; flex-direction: column; padding: 20px 5vw;
        border-bottom: 1px solid #e2e8f0; gap: 16px;
      }
      .nav-links.open { display: flex; }
    }
    main { min-height: calc(100vh - 64px); }
  `]
})
export class AppComponent implements OnInit {
  loggedIn = false;
  role = '';
  menuOpen = false;
  showNav = true;

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

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
    this.router.navigate(['/']);
  }
}
