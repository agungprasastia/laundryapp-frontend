import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-pesanan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Kelola Pesanan</h1>

      <!-- Filters -->
      <div class="filters">
        <select [(ngModel)]="filterStatus" (change)="load()">
          <option value="">Semua Status</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <select [(ngModel)]="filterBayar" (change)="load()">
          <option value="">Semua Pembayaran</option>
          <option *ngFor="let s of statusBayar" [value]="s">{{ s }}</option>
        </select>
        <input type="text" [(ngModel)]="searchQuery" placeholder="Cari nama/HP..." (input)="filterLocal()" />
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Paket</th>
              <th>Berat (kg)</th>
              <th>Total</th>
              <th>Status</th>
              <th>Pembayaran</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filtered">
              <td class="id-col">#{{ p.id }}</td>
              <td>
                <div class="customer">{{ p.profiles?.full_name || '-' }}</div>
                <small>{{ p.profiles?.phone || '' }}</small>
              </td>
              <td>{{ p.pakets?.nama_paket }}</td>
              <td>
                <input type="number" class="weight-input" [(ngModel)]="p._berat" step="0.1" min="0"
                       (blur)="updateBerat(p)" [placeholder]="p.berat" />
              </td>
              <td class="total-col">Rp {{ p.total_bayar | number:'1.0-0' }}</td>
              <td>
                <select class="status-select" [(ngModel)]="p._status" (change)="updateStatus(p)"
                        [class]="'sel-' + p.status.toLowerCase()">
                  <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td>
                <select class="status-select" [(ngModel)]="p._statusBayar" (change)="updateStatusBayar(p)">
                  <option *ngFor="let s of statusBayar" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td>{{ p.tanggal }}</td>
              <td>
                <button *ngIf="p.bukti_bayar_url" class="btn-icon" (click)="viewBukti(p)" title="Lihat bukti bayar">
                  <span class="material-icons">receipt</span>
                </button>
                <button class="btn-icon delete" (click)="confirmDelete(p)" title="Hapus">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!filtered.length && !loading" class="empty">Tidak ada pesanan ditemukan</div>

      <!-- Bukti modal -->
      <div class="modal-overlay" *ngIf="buktiUrl" (click)="buktiUrl = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Bukti Pembayaran</h2>
          <img [src]="buktiUrl" alt="Bukti bayar" class="bukti-img" />
          <button (click)="buktiUrl = null" class="btn-close">Tutup</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
    .filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .filters select, .filters input {
      padding: 8px 14px; border: 2px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none; background: white;
    }
    .filters select:focus, .filters input:focus { border-color: #0d9488; }
    .table-wrap { overflow-x: auto; background: white; border-radius: 16px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { padding: 14px 12px; text-align: left; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .id-col { font-weight: 700; color: #0f172a; }
    .customer { font-weight: 600; color: #0f172a; }
    small { color: #94a3b8; font-size: 12px; }
    .total-col { font-weight: 700; color: #0d9488; white-space: nowrap; }
    .weight-input {
      width: 80px; padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 14px; text-align: center;
    }
    .weight-input:focus { border-color: #0d9488; outline: none; }
    .status-select {
      padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; cursor: pointer; background: white;
    }
    .btn-icon {
      width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: 6px;
      background: white; cursor: pointer; display: inline-flex; align-items: center;
      justify-content: center; margin-right: 4px;
    }
    .btn-icon .material-icons { font-size: 16px; color: #64748b; }
    .btn-icon:hover { background: #f1f5f9; }
    .btn-icon.delete:hover { background: #fef2f2; }
    .btn-icon.delete:hover .material-icons { color: #dc2626; }
    .empty { text-align: center; padding: 40px; color: #94a3b8; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: white; border-radius: 16px; padding: 24px; max-width: 500px; width: 90%; text-align: center; }
    .modal h2 { margin-bottom: 16px; }
    .bukti-img { max-width: 100%; max-height: 400px; border-radius: 8px; }
    .btn-close { margin-top: 16px; padding: 10px 24px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
  `]
})
export class AdminPesananComponent implements OnInit {
  pesanans: any[] = [];
  filtered: any[] = [];
  filterStatus = '';
  filterBayar = '';
  searchQuery = '';
  loading = true;
  buktiUrl: string | null = null;

  statuses = ['Baru', 'Proses', 'Selesai', 'Diambil'];
  statusBayar = ['Belum Lunas', 'Menunggu Verifikasi', 'Lunas'];

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    const params: any = {};
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterBayar) params.status_bayar = this.filterBayar;

    this.api.getAdminPesanan(params).subscribe(d => {
      this.pesanans = d.map(p => ({ ...p, _berat: p.berat, _status: p.status, _statusBayar: p.status_bayar }));
      this.filterLocal();
      this.loading = false;
    });
  }

  filterLocal() {
    const q = this.searchQuery.toLowerCase();
    this.filtered = this.pesanans.filter(p => {
      if (!q) return true;
      return (p.profiles?.full_name || '').toLowerCase().includes(q) ||
             (p.profiles?.phone || '').includes(q) ||
             String(p.id).includes(q);
    });
  }

  updateBerat(p: any) {
    if (p._berat === p.berat) return;
    this.api.updatePesanan(p.id, { berat: parseFloat(p._berat) }).subscribe(updated => {
      Object.assign(p, updated, { _berat: updated.berat, _status: updated.status, _statusBayar: updated.status_bayar });
    });
  }

  updateStatus(p: any) {
    const data: any = { status: p._status };
    if (p._status === 'Selesai') data.tanggal_selesai = new Date().toISOString().split('T')[0];
    this.api.updatePesanan(p.id, data).subscribe(updated => {
      Object.assign(p, updated, { _berat: updated.berat, _status: updated.status, _statusBayar: updated.status_bayar });
    });
  }

  updateStatusBayar(p: any) {
    this.api.updatePesanan(p.id, { status_bayar: p._statusBayar }).subscribe(updated => {
      Object.assign(p, updated, { _berat: updated.berat, _status: updated.status, _statusBayar: updated.status_bayar });
    });
  }

  viewBukti(p: any) {
    this.api.getBuktiBayarUrl(p.bukti_bayar_url).subscribe(res => {
      this.buktiUrl = res.url;
    });
  }

  confirmDelete(p: any) {
    if (confirm(`Hapus pesanan #${p.id}?`)) {
      this.api.deletePesanan(p.id).subscribe(() => this.load());
    }
  }
}
