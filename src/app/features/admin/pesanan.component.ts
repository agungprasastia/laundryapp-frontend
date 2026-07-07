import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        
        <!-- Search Bar -->
        <div class="relative w-full md:w-96">
          <span class="material-icons absolute left-4 top-3.5 text-slate-400">search</span>
          <input type="text" [(ngModel)]="searchQuery" (input)="filterLocal()" 
                 placeholder="Cari ID, Nama Pelanggan, atau No. HP..." 
                 class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
        </div>

        <!-- Filter Chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-medium text-slate-500 mr-2 hidden md:block">Filter:</span>
          
          <button (click)="filterStatus = ''; filterLocal()" 
                  class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  [ngClass]="filterStatus === '' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'">
            Semua
          </button>
          
          <button *ngFor="let s of statuses" (click)="filterStatus = s; filterLocal()"
                  class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  [ngClass]="filterStatus === s ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'">
            {{ s }}
          </button>
          
          <div class="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <!-- Filter Bayar Selection -->
          <div class="relative group">
            <select [(ngModel)]="filterBayar" (change)="filterLocal()" 
                    class="appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-2 pr-8 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all">
              <option value="">Semua Pembayaran</option>
              <option *ngFor="let s of statusBayar" [value]="s">{{ s }}</option>
            </select>
            <span class="material-icons absolute right-2 top-2.5 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap animate-fade-up animate-stagger-1" *ngIf="!loading">
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
              <td class="total-col">Rp {{ ((p._berat || 0) * (p.pakets?.harga || 0)) | number:'1.0-0' }}</td>
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
                <button *ngIf="p.profiles?.phone" class="btn-icon wa" (click)="hubungiWA(p)" title="Hubungi via WA">
                  <span class="material-icons text-emerald-500">chat</span>
                </button>
                <button *ngIf="p.bukti_bayar_url" class="btn-icon" (click)="viewBukti(p)" title="Lihat bukti bayar">
                  <span class="material-icons">receipt</span>
                </button>
                <button class="btn-icon" (click)="printInvoice(p)" title="Cetak Invoice">
                  <span class="material-icons">print</span>
                </button>
                <button class="btn-icon delete" (click)="confirmDelete(p)" title="Hapus">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="animate-fade-up animate-stagger-1">
        <div class="h-[400px] w-full rounded-2xl animate-shimmer"></div>
      </div>

      <div *ngIf="!filtered.length && !loading" class="empty">Tidak ada pesanan ditemukan</div>

      <!-- Bukti modal -->
      <div class="modal-overlay no-print" *ngIf="buktiUrl" (click)="buktiUrl = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Bukti Pembayaran</h2>
          <img [src]="buktiUrl" alt="Bukti bayar" class="bukti-img" />
          <button (click)="buktiUrl = null" class="btn-close">Tutup</button>
        </div>
      </div>

      <!-- Invoice Print Area (Only visible during printing) -->
      <div class="invoice-print-area print-only" *ngIf="invoiceData">
        <div class="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-6">
          <h2 class="text-2xl font-bold font-serif mb-1">Laundry Kinclong</h2>
          <p class="text-sm text-slate-500">Jl. Bersih Selalu No. 123, Jakarta</p>
          <p class="text-sm text-slate-500">Telp: 0812-3456-7890</p>
          <div class="mt-4 font-bold text-lg">INVOICE #{{ invoiceData.id }}</div>
        </div>
        
        <div class="row"><span>Pelanggan:</span><strong>{{ invoiceData.profiles?.full_name }} ({{ invoiceData.profiles?.phone }})</strong></div>
        <div class="row"><span>Paket:</span><strong>{{ invoiceData.pakets?.nama_paket }}</strong></div>
        <div class="row"><span>Harga/kg:</span><strong>Rp {{ invoiceData.pakets?.harga | number:'1.0-0' }}</strong></div>
        <div class="row"><span>Berat:</span><strong>{{ invoiceData.berat }} kg</strong></div>
        <div class="row"><span>Total Bayar:</span><strong class="text-xl font-bold text-slate-800">Rp {{ invoiceData.total_bayar | number:'1.0-0' }}</strong></div>
        <div class="row"><span>Status Bayar:</span><strong>{{ invoiceData.status_bayar }}</strong></div>
        <div class="row"><span>Tanggal Masuk:</span><strong>{{ invoiceData.tanggal }}</strong></div>
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
    .btn-icon:active { transform: scale(0.95); }
    .btn-icon.wa:hover { background: #d1fae5; border-color: #34d399; }
    .btn-icon.wa:hover .material-icons { color: #10b981; }
    .btn-icon.delete:hover { background: #fee2e2; border-color: #f87171; }
    .btn-icon.delete:hover .material-icons { color: #dc2626; }
    .empty { text-align: center; padding: 40px; color: #94a3b8; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: white; border-radius: 16px; padding: 24px; max-width: 500px; width: 90%; text-align: center; }
    .modal h2 { margin-bottom: 16px; }
    .bukti-img { max-width: 100%; max-height: 400px; border-radius: 8px; }
    .btn-close { margin-top: 16px; padding: 10px 24px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    
    .print-only { display: none; }
    @media print {
      body * { visibility: hidden; }
      app-admin-pesanan { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; }
      .invoice-print-area, .invoice-print-area * { visibility: visible; }
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      .invoice-print-area { padding: 40px; width: 100%; max-width: 800px; margin: 0 auto; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; color: #0f172a; }
    }
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
  invoiceData: any = null;

  statuses = ['Baru', 'Proses', 'Selesai', 'Diambil'];
  statusBayar = ['Belum Lunas', 'Menunggu Verifikasi', 'Lunas'];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterBayar) params.status_bayar = this.filterBayar;

    this.api.getAdminPesanan(params).subscribe({
      next: d => {
        this.pesanans = d.map(p => ({ ...p, _berat: p.berat, _status: p.status, _statusBayar: p.status_bayar }));
        this.filterLocal();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
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
      this.cdr.detectChanges();
    });
  }

  printInvoice(p: any) {
    this.invoiceData = p;
    setTimeout(() => {
      window.print();
      setTimeout(() => this.invoiceData = null, 100);
    }, 100);
  }

  confirmDelete(p: any) {
    if (confirm('Yakin menghapus pesanan ini?')) {
      this.api.deletePesanan(p.id).subscribe(() => this.load());
    }
  }

  hubungiWA(p: any) {
    if (!p.profiles?.phone) return;
    let phone = p.profiles.phone.toString().trim();
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const message = `Halo Kak ${p.profiles.full_name}, kami dari Laundry Kinclong ingin menginformasikan terkait pesanan Anda (ID: #${p.id}) dengan status *${p.status}* dan pembayaran *${p.status_bayar}*.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
