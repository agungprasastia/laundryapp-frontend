import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { StatusStepperComponent } from '../../shared/components/status-stepper.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-pesanan-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusStepperComponent, StatusBadgeComponent],
  template: `
    <div class="page">
      <div class="container animate-fade-up" *ngIf="pesanan && !loading">
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

        <div class="actions no-print flex gap-4 justify-center" *ngIf="pesanan.status_bayar !== 'Lunas' && pesanan.total_bayar > 0">
          <a [routerLink]="['/user/bayar', pesanan.id]" class="btn-primary hover:scale-105 active:scale-95">Upload Bukti Bayar</a>
        </div>
        
        <div class="actions no-print flex gap-4 justify-center mt-6">
          <button (click)="printInvoice()" class="btn-outline flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <span class="material-icons">print</span> Cetak Invoice
          </button>
        </div>
        
        <!-- Rating & Ulasan Section -->
        <div class="mt-8 no-print bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" *ngIf="pesanan.status === 'Selesai'">
          <h3 class="font-bold text-lg text-slate-800 mb-2">Beri Ulasan Pesanan</h3>
          <p class="text-sm text-slate-500 mb-4">Bagaimana pengalaman Anda dengan layanan kami?</p>
          
          <div *ngIf="!ulasanSukses">
            <div class="flex gap-2 mb-4">
              <span class="material-icons cursor-pointer text-3xl transition-colors" 
                    *ngFor="let star of [1,2,3,4,5]" 
                    (click)="rating = star"
                    [ngClass]="star <= rating ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-200'">
                star
              </span>
            </div>
            
            <textarea [(ngModel)]="ulasanText" placeholder="Tuliskan pengalaman Anda di sini (opsional)..." 
                      class="w-full p-4 border border-slate-200 rounded-xl mb-4 h-24 outline-none focus:border-primary resize-none text-sm"></textarea>
            
            <button (click)="submitRating()" [disabled]="!rating || submittingRating" 
                    class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submittingRating ? 'Menyimpan...' : 'Kirim Ulasan' }}
            </button>
          </div>
          
          <div *ngIf="ulasanSukses" class="text-center p-4 bg-emerald-50 rounded-xl">
            <span class="material-icons text-emerald-500 text-4xl mb-2">check_circle</span>
            <p class="text-emerald-700 font-bold">Terima kasih atas ulasan Anda!</p>
          </div>
        </div>

        <!-- Print Header (Only visible when printing) -->
        <div class="print-only text-center mb-8 border-b-2 border-dashed border-slate-300 pb-4">
          <h2 class="text-2xl font-bold font-serif mb-1">Laundry Kinclong</h2>
          <p class="text-sm text-slate-500">Jl. Bersih Selalu No. 123, Jakarta</p>
          <p class="text-sm text-slate-500">Telp: 0812-3456-7890</p>
          <div class="mt-4 font-bold text-lg">INVOICE #{{ pesanan.id }}</div>
        </div>
      </div>
      <div *ngIf="loading" class="container animate-fade-up">
        <div class="h-8 w-24 mb-4 rounded-lg animate-shimmer"></div>
        <div class="h-8 w-48 mb-6 rounded-lg animate-shimmer"></div>
        <div class="h-16 w-full rounded-xl animate-shimmer mb-6"></div>
        <div class="h-[400px] w-full rounded-2xl animate-shimmer"></div>
      </div>
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
      border-radius: 10px; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; border: none;
    }
    .btn-primary:hover { background: #0f766e; }
    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; padding: 10px 24px; background: white; color: #0f172a;
      border-radius: 10px; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; border: 1px solid #cbd5e1;
    }
    .print-only { display: none; }
    
    @media print {
      body * { visibility: hidden; }
      app-pesanan-detail, app-pesanan-detail * { visibility: visible; }
      app-pesanan-detail { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
      .page { background: white; padding: 0; }
      .container { max-width: 100%; width: 100%; padding: 20px; box-sizing: border-box; }
      .detail-card { border: none; padding: 0; margin-top: 10px; }
      .row { border-bottom: 1px dashed #cbd5e1; padding: 8px 0; }
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      h1 { display: none; }
      app-status-stepper { display: none; }
    }
  `]
})
export class PesananDetailComponent implements OnInit {
  pesanan: any = null;
  loading = true;
  
  rating = 0;
  ulasanText = '';
  submittingRating = false;
  ulasanSukses = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.api.getPesanan(id).subscribe({
      next: d => { 
        this.pesanan = d; 
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  printInvoice() {
    window.print();
  }

  submitRating() {
    if (!this.rating) return;
    this.submittingRating = true;
    this.api.addRating(this.pesanan.id, { rating: this.rating, ulasan: this.ulasanText }).subscribe({
      next: () => {
        this.submittingRating = false;
        this.ulasanSukses = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Gagal mengirim ulasan:', err);
        this.submittingRating = false;
        this.cdr.detectChanges();
        alert('Gagal mengirim ulasan.');
      }
    });
  }
}
