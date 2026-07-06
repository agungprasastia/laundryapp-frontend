import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StatusStepperComponent } from '../../shared/components/status-stepper.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-pesanan-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusStepperComponent, StatusBadgeComponent],
  template: `
    <div class="page">
      <div class="container" *ngIf="pesanan">
        <a routerLink="/user" class="back-link">
          <span class="material-icons">arrow_back</span> Kembali
        </a>
        <h1>Pesanan #{{ pesanan.id }}</h1>

        <app-status-stepper [status]="pesanan.status"></app-status-stepper>

        <div class="detail-card">
          <div class="row"><span>Paket</span><strong>{{ pesanan.pakets?.nama_paket }}</strong></div>
          <div class="row"><span>Harga/kg</span><strong>Rp {{ pesanan.pakets?.harga | number:'1.0-0' }}</strong></div>
          <div class="row"><span>Berat</span><strong>{{ pesanan.berat }} kg</strong></div>
          <div class="row"><span>Total Bayar</span><strong class="total">Rp {{ pesanan.total_bayar | number:'1.0-0' }}</strong></div>
          <div class="row"><span>Tanggal</span><strong>{{ pesanan.tanggal }}</strong></div>
          <div class="row" *ngIf="pesanan.tanggal_selesai"><span>Selesai</span><strong>{{ pesanan.tanggal_selesai }}</strong></div>
          <div class="row"><span>Estimasi</span><strong>{{ pesanan.pakets?.estimasi || '-' }}</strong></div>
          <div class="row"><span>Status</span><app-status-badge [text]="pesanan.status"></app-status-badge></div>
          <div class="row"><span>Pembayaran</span><app-status-badge [text]="pesanan.status_bayar" type="bayar"></app-status-badge></div>
          <div class="row" *ngIf="pesanan.catatan"><span>Catatan</span><strong>{{ pesanan.catatan }}</strong></div>
        </div>

        <div class="actions" *ngIf="pesanan.status_bayar !== 'Lunas' && pesanan.total_bayar > 0">
          <a [routerLink]="['/user/bayar', pesanan.id]" class="btn-primary">Upload Bukti Bayar</a>
        </div>
      </div>
      <div *ngIf="loading" class="page"><div class="skeleton"></div></div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; min-height: 60vh; background: #f8fafc; }
    .container { max-width: 640px; margin: 0 auto; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: #64748b; text-decoration: none; font-size: 14px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .detail-card {
      background: white; border-radius: 16px; padding: 24px;
      border: 1px solid #e2e8f0; margin-top: 24px;
    }
    .row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;
    }
    .row:last-child { border-bottom: none; }
    .row span { color: #64748b; }
    .row strong { color: #0f172a; }
    .total { color: #0d9488; font-size: 18px; }
    .actions { margin-top: 24px; text-align: center; }
    .btn-primary {
      display: inline-block; padding: 12px 28px; background: #0d9488; color: white;
      border-radius: 10px; font-weight: 600; text-decoration: none; transition: background 0.2s;
    }
    .btn-primary:hover { background: #0f766e; }
    .skeleton { height: 400px; border-radius: 16px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class PesananDetailComponent implements OnInit {
  pesanan: any = null;
  loading = true;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.api.getPesanan(id).subscribe({
      next: d => { this.pesanan = d; this.loading = false; },
      error: () => this.loading = false,
    });
  }
}
