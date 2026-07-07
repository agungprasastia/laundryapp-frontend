import { Component, ChangeDetectorRef } from '@angular/core';
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
    <div class="min-h-[80vh] bg-surface-dark py-16 px-6 font-sans relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl"></div>
      
      <div class="max-w-3xl mx-auto relative z-10">
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-serif">Cek Status Pesanan</h1>
          <p class="text-slate-500">Masukkan nomor HP atau ID pesanan Anda untuk melacak progress laundry.</p>
        </div>

        <div class="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 transition-all duration-300 focus-within:shadow-md focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 mb-2">
          <span class="material-icons text-slate-400 pl-4">search</span>
          <input
            type="text" [(ngModel)]="query" placeholder="Contoh: 081234567890 atau ID Pesanan..."
            class="flex-1 border-none outline-none text-slate-700 placeholder-slate-400 py-3 bg-transparent text-base"
            (keyup.enter)="search()" [disabled]="loading"
          />
          <button (click)="search()" [disabled]="loading || !query.trim()" 
            class="bg-primary hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
            {{ loading ? 'Mencari...' : 'Lacak' }}
          </button>
        </div>

        <div *ngIf="error" class="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 mt-4 animate-slideInUp">
          <span class="material-icons text-red-500">error_outline</span>
          {{ error }}
        </div>

        <div *ngIf="searched && !results.length && !loading && !error" class="text-center py-16 px-6 mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm animate-slideInUp">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-icons text-5xl text-slate-300">inbox</span>
          </div>
          <h3 class="text-lg font-bold text-slate-700 mb-2 font-sans">Pesanan Tidak Ditemukan</h3>
          <p class="text-slate-500 text-sm">Pastikan nomor HP atau ID pesanan yang Anda masukkan sudah benar.</p>
        </div>

        <div class="mt-10 flex flex-col gap-6" *ngIf="results.length">
          <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 animate-slideInUp" *ngFor="let r of results">
            <div class="flex flex-wrap justify-between items-center mb-8 gap-4 border-b border-slate-100 pb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span class="material-icons text-primary">receipt_long</span>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">ID Pesanan</p>
                  <span class="text-xl font-bold text-slate-900">#{{ r.id }}</span>
                </div>
              </div>
              <app-status-badge [text]="r.status"></app-status-badge>
            </div>
            
            <div class="mb-8">
              <app-status-stepper [status]="r.status"></app-status-stepper>
            </div>
            
            <div class="bg-slate-50 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p class="text-xs text-slate-400 font-medium mb-1">Paket Layanan</p>
                <p class="font-semibold text-slate-800">{{ r.pakets?.nama_paket || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium mb-1">Berat / Jumlah</p>
                <p class="font-semibold text-slate-800">{{ r.berat }} kg</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium mb-1">Tanggal Masuk</p>
                <p class="font-semibold text-slate-800">{{ r.tanggal }}</p>
              </div>
              <div *ngIf="r.tanggal_selesai">
                <p class="text-xs text-slate-400 font-medium mb-1">Tanggal Selesai</p>
                <p class="font-semibold text-slate-800">{{ r.tanggal_selesai }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium mb-1">Total Tagihan</p>
                <p class="font-bold text-primary text-lg">Rp {{ r.total_bayar | number:'1.0-0' }}</p>
              </div>
              <div class="flex flex-col justify-center">
                <p class="text-xs text-slate-400 font-medium mb-1">Status Pembayaran</p>
                <div class="mt-1">
                  <app-status-badge [text]="r.status_bayar" type="bayar"></app-status-badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideInUp {
      animation: slideInUp 0.4s ease-out forwards;
    }
  `]
})
export class CekStatusComponent {
  query = '';
  results: any[] = [];
  loading = false;
  error = '';
  searched = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  search() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';
    this.searched = true;
    this.cdr.detectChanges();
    this.api.cekStatus(this.query.trim()).subscribe({
      next: data => { 
        this.results = data; 
        this.loading = false; 
        this.cdr.detectChanges(); 
      },
      error: () => { 
        this.error = 'Gagal mencari pesanan. Pastikan backend aktif atau koneksi internet stabil.'; 
        this.loading = false; 
        this.cdr.detectChanges(); 
      },
    });
  }
}
