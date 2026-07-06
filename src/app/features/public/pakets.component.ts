import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-pakets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="font-sans min-h-[80vh] bg-surface-dark py-16 px-6 relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">Layanan & Harga</h1>
          <p class="text-slate-500 max-w-2xl mx-auto">Temukan berbagai paket layanan laundry kami yang dirancang khusus untuk memenuhi kebutuhan kebersihan harian hingga perlindungan pakaian premium Anda.</p>
        </div>

        <div class="text-center py-20" *ngIf="!pakets.length && !errorMessage">
            <span class="material-icons text-6xl text-slate-300 mb-4 animate-spin">hourglass_empty</span>
            <p class="text-slate-500">Memuat paket layanan...</p>
        </div>

        <div class="text-center py-20 bg-red-50 rounded-2xl border border-red-100" *ngIf="errorMessage">
            <span class="material-icons text-6xl text-red-300 mb-4">error_outline</span>
            <p class="text-red-600 font-medium">{{ errorMessage }}</p>
            <p class="text-red-400 text-sm mt-2">Pastikan backend Anda merespons dengan benar.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="pakets.length">
          <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group animate-slideInUp" *ngFor="let p of pakets; let i = index" [style.animation-delay]="(i * 100) + 'ms'">
            <div class="relative h-64 overflow-hidden">
              <img *ngIf="p.foto_url" [src]="p.foto_url" [alt]="p.nama_paket" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div *ngIf="!p.foto_url" class="w-full h-full bg-gradient-to-br from-primary-50 to-accent/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <span class="material-icons text-7xl text-primary/30">dry_cleaning</span>
              </div>
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm" *ngIf="p.estimasi">
                ⏱ {{ p.estimasi }}
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-slate-900 mb-3 font-sans">{{ p.nama_paket }}</h3>
              <p class="text-slate-500 text-sm mb-8 line-clamp-3 min-h-[60px] leading-relaxed">{{ p.deskripsi || 'Layanan laundry premium dengan penanganan khusus menggunakan deterjen berkualitas tinggi, pelembut ramah serat kain, dan setrika presisi.' }}</p>
              
              <div class="bg-slate-50 rounded-2xl p-4 mb-8">
                <div class="flex items-end gap-1">
                  <span class="text-3xl font-bold text-primary">Rp {{ p.harga | number:'1.0-0' }}</span>
                  <span class="text-slate-500 font-medium mb-1">/ {{ p.nama_paket.toLowerCase().includes('satuan') || p.nama_paket.toLowerCase().includes('sepatu') ? 'pcs' : 'kg' }}</span>
                </div>
              </div>

              <a routerLink="/register" class="btn btn-primary w-full shadow-lg shadow-primary/20">Pesan Sekarang</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideInUp {
      animation: slideInUp 0.5s ease-out forwards;
      opacity: 0;
    }
  `]
})
export class PaketsComponent implements OnInit {
  pakets: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.api.getPakets().subscribe({
      next: (data) => {
        this.pakets = data || [];
        this.errorMessage = null;
        this.cdr.detectChanges(); // Force UI to update
      },
      error: (err) => {
        this.errorMessage = 'Gagal mengambil data dari server: ' + (err.message || 'Unknown Error');
        this.cdr.detectChanges();
      }
    });
  }
}
