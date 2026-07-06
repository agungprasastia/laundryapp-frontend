import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { StatusStepperComponent } from '../../shared/components/status-stepper.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-cek-status',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusStepperComponent, StatusBadgeComponent],
  template: `
    <div class="page">
      <div class="container">
        <h1>Cek Status Pesanan</h1>
        <p class="subtitle">Masukkan nomor HP atau ID pesanan Anda</p>

        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            type="text" [(ngModel)]="query" placeholder="Nomor HP atau ID pesanan..."
            (keyup.enter)="search()" [disabled]="loading"
          />
          <button (click)="search()" [disabled]="loading || !query.trim()">
            {{ loading ? 'Mencari...' : 'Cari' }}
          </button>
        </div>

        <div *ngIf="error" class="error-msg">{{ error }}</div>

        <div *ngIf="searched && !results.length && !loading" class="empty">
          <span class="material-icons">inbox</span>
          <p>Tidak ditemukan pesanan dengan pencarian tersebut</p>
        </div>

        <div class="results" *ngIf="results.length">
          <div class="result-card" *ngFor="let r of results">
            <div class="result-header">
              <span class="order-id">#{{ r.id }}</span>
              <app-status-badge [text]="r.status"></app-status-badge>
            </div>
            <app-status-stepper [status]="r.status"></app-status-stepper>
            <div class="result-details">
              <div class="detail"><strong>Paket:</strong> {{ r.pakets?.nama_paket }}</div>
              <div class="detail"><strong>Berat:</strong> {{ r.berat }} kg</div>
              <div class="detail"><strong>Total:</strong> Rp {{ r.total_bayar | number:'1.0-0' }}</div>
              <div class="detail"><strong>Tanggal:</strong> {{ r.tanggal }}</div>
              <div class="detail" *ngIf="r.tanggal_selesai"><strong>Selesai:</strong> {{ r.tanggal_selesai }}</div>
              <div class="detail">
                <strong>Pembayaran:</strong>
                <app-status-badge [text]="r.status_bayar" type="bayar"></app-status-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 80vh; background: #f8fafc; padding: 60px 5vw; }
    .container { max-width: 700px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .subtitle { color: #64748b; margin-bottom: 24px; }
    .search-box {
      display: flex; align-items: center; background: white; border: 2px solid #e2e8f0;
      border-radius: 12px; padding: 4px 4px 4px 16px; gap: 8px; transition: border-color 0.2s;
    }
    .search-box:focus-within { border-color: #0d9488; }
    .search-box .material-icons { color: #94a3b8; }
    .search-box input {
      flex: 1; border: none; outline: none; font-size: 15px; padding: 10px 0; background: transparent;
    }
    .search-box button {
      background: #0d9488; color: white; border: none; padding: 10px 24px;
      border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    .search-box button:hover { background: #0f766e; }
    .search-box button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-msg { color: #dc2626; margin-top: 12px; font-size: 14px; }
    .empty {
      text-align: center; padding: 60px 20px; color: #94a3b8;
    }
    .empty .material-icons { font-size: 64px; margin-bottom: 12px; }
    .results { margin-top: 32px; display: flex; flex-direction: column; gap: 20px; }
    .result-card {
      background: white; border-radius: 16px; padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
    }
    .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .order-id { font-size: 18px; font-weight: 700; color: #0f172a; }
    .result-details {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;
      font-size: 14px; color: #374151;
    }
    @media (max-width: 640px) { .result-details { grid-template-columns: 1fr; } }
  `]
})
export class CekStatusComponent {
  query = '';
  results: any[] = [];
  loading = false;
  error = '';
  searched = false;

  constructor(private api: ApiService) {}

  search() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';
    this.searched = true;
    this.api.cekStatus(this.query.trim()).subscribe({
      next: data => { this.results = data; this.loading = false; },
      error: () => { this.error = 'Gagal mencari pesanan'; this.loading = false; },
    });
  }
}
