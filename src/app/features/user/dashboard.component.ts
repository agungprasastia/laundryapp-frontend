import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { StatusStepperComponent } from '../../shared/components/status-stepper.component';
import { StatCardComponent } from '../../shared/components/stat-card.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, StatusStepperComponent, StatCardComponent],
  template: `
    <div class="page">
      <div class="header">
        <h1>Dashboard Saya</h1>
        <a routerLink="/user/pesan" class="btn-primary">
          <span class="material-icons">add</span> Buat Pesanan
        </a>
      </div>

      <!-- Stats -->
      <div class="stats-grid" *ngIf="data">
        <app-stat-card label="Total Pesanan" [value]="data.stats.total" icon="receipt_long" color="#0d9488"></app-stat-card>
        <app-stat-card label="Baru" [value]="data.stats.baru" icon="fiber_new" color="#3b82f6"></app-stat-card>
        <app-stat-card label="Proses" [value]="data.stats.proses" icon="autorenew" color="#f59e0b"></app-stat-card>
        <app-stat-card label="Selesai" [value]="data.stats.selesai" icon="check_circle" color="#10b981"></app-stat-card>
      </div>

      <!-- Pesanan list -->
      <div class="section" *ngIf="data">
        <h2>Riwayat Pesanan</h2>
        <div *ngIf="!data.pesanans.length" class="empty">
          <span class="material-icons">inbox</span>
          <p>Belum ada pesanan</p>
        </div>
        <div class="pesanan-list">
          <div class="pesanan-card" *ngFor="let p of data.pesanans">
            <div class="card-top">
              <div>
                <span class="order-id">#{{ p.id }}</span>
                <span class="paket-name">{{ p.pakets?.nama_paket }}</span>
              </div>
              <app-status-badge [text]="p.status"></app-status-badge>
            </div>
            <app-status-stepper [status]="p.status"></app-status-stepper>
            <div class="card-details">
              <span>{{ p.tanggal }}</span>
              <span>{{ p.berat }} kg</span>
              <span class="total">Rp {{ p.total_bayar | number:'1.0-0' }}</span>
              <app-status-badge [text]="p.status_bayar" type="bayar"></app-status-badge>
            </div>
            <div class="card-actions">
              <a [routerLink]="['/user/pesanan', p.id]" class="link">Detail</a>
              <a *ngIf="p.status_bayar !== 'Lunas' && p.total_bayar > 0"
                 [routerLink]="['/user/bayar', p.id]" class="link accent">Bayar</a>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="skeleton" *ngFor="let i of [1,2,3]"></div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; max-width: 1000px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px;
      background: #0d9488; color: white; border-radius: 10px; text-decoration: none;
      font-weight: 600; font-size: 14px; transition: background 0.2s;
    }
    .btn-primary:hover { background: #0f766e; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .section h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
    .empty .material-icons { font-size: 64px; margin-bottom: 8px; }
    .pesanan-list { display: flex; flex-direction: column; gap: 16px; }
    .pesanan-card {
      background: white; border-radius: 16px; padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
    }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .order-id { font-weight: 700; color: #0f172a; margin-right: 8px; }
    .paket-name { color: #64748b; font-size: 14px; }
    .card-details {
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      margin-top: 16px; font-size: 14px; color: #374151;
    }
    .total { font-weight: 700; color: #0d9488; }
    .card-actions { display: flex; gap: 16px; margin-top: 12px; }
    .link { font-size: 14px; font-weight: 600; color: #0d9488; text-decoration: none; }
    .link.accent { color: #f59e0b; }
    .loading { display: flex; flex-direction: column; gap: 16px; }
    .skeleton { height: 140px; border-radius: 16px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class UserDashboardComponent implements OnInit {
  data: any = null;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUserDashboard().subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: () => this.loading = false,
    });
  }
}
