import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    <div class="p-6 md:p-8 font-sans w-full max-w-5xl mx-auto">
        
        <!-- Header Banner -->
        <div class="animate-fade-up bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-lg shadow-primary/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-1000 group-hover:scale-150"></div>
          <div class="relative z-10">
            <h1 class="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">Dashboard Saya👋</h1>
            <p class="text-primary-100 text-lg">Kelola dan pantau pesanan laundry Anda dengan mudah.</p>
          </div>
          <a routerLink="/user/pesan" class="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-md w-full md:w-auto">
            <span class="material-icons text-xl">add_circle</span> Buat Pesanan Baru
          </a>
        </div>

        <!-- Stats -->
        <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 mb-8 flex items-center gap-2">
          <span class="material-icons">error_outline</span> {{ errorMsg }}
        </div>

        <!-- Skeleton Loading -->
        <div *ngIf="loading" class="animate-fade-up">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            <div *ngFor="let i of [1,2,3,4]" class="h-[104px] rounded-xl animate-shimmer"></div>
          </div>
          <div class="flex flex-col gap-6">
            <div class="h-32 rounded-3xl animate-shimmer" *ngFor="let i of [1,2,3]"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10" *ngIf="data && !loading">
          <app-stat-card class="animate-fade-up animate-stagger-1" label="Total Pesanan" [value]="data.stats.total" icon="receipt_long" color="#0d9488"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-2" label="Baru" [value]="data.stats.baru" icon="fiber_new" color="#3b82f6"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-3" label="Proses" [value]="data.stats.proses" icon="autorenew" color="#f59e0b"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-4" label="Selesai" [value]="data.stats.selesai" icon="check_circle" color="#10b981"></app-stat-card>
        </div>

        <!-- Pesanan list -->
        <div *ngIf="data && !loading" class="mb-10">
          <div class="flex items-center justify-between mb-6 animate-fade-up animate-stagger-1">
            <h2 class="text-2xl font-bold text-slate-800 font-sans">Riwayat Pesanan</h2>
          </div>
          
          <div *ngIf="!data.pesanans.length" class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm animate-fade-up animate-stagger-2">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-icons text-5xl text-slate-300">inbox</span>
            </div>
            <h3 class="text-xl font-bold text-slate-700 mb-2 font-sans">Belum ada pesanan</h3>
            <p class="text-slate-500 mb-8">Anda belum pernah membuat pesanan laundry.</p>
            <a routerLink="/user/pesan" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary/20 hover:scale-105 active:scale-95 duration-300">
              Mulai Pesanan Pertama
            </a>
          </div>

          <div class="flex flex-col gap-6" *ngIf="data.pesanans.length">
            <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 interactive-hover animate-fade-up" *ngFor="let p of data.pesanans; let i = index" [style.animation-delay]="(i * 100 + 200) + 'ms'">
              
              <div class="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-slate-100 pb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span class="material-icons text-primary">receipt_long</span>
                  </div>
                  <div>
                    <span class="text-xl font-bold text-slate-900 block">#{{ p.id }}</span>
                    <span class="text-sm font-medium text-slate-500">{{ p.pakets?.nama_paket }}</span>
                  </div>
                </div>
                <app-status-badge [text]="p.status"></app-status-badge>
              </div>

              <div class="mb-8">
                <app-status-stepper [status]="p.status"></app-status-stepper>
              </div>
              
              <div class="bg-slate-50 rounded-2xl p-5 md:p-6 flex flex-wrap items-center justify-between gap-6">
                <div class="flex gap-8 flex-wrap">
                  <div>
                    <p class="text-xs text-slate-400 font-medium mb-1">Tanggal</p>
                    <p class="font-semibold text-slate-800">{{ p.tanggal }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 font-medium mb-1">Berat</p>
                    <p class="font-semibold text-slate-800">{{ p.berat }} kg</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 font-medium mb-1">Total</p>
                    <p class="font-bold text-primary">Rp {{ p.total_bayar | number:'1.0-0' }}</p>
                  </div>
                  <div class="flex flex-col justify-center">
                    <p class="text-xs text-slate-400 font-medium mb-1">Pembayaran</p>
                    <app-status-badge [text]="p.status_bayar" type="bayar"></app-status-badge>
                  </div>
                </div>
                
                <div class="flex gap-3 w-full md:w-auto mt-4 md:mt-0 border-t border-slate-200 pt-4 md:border-0 md:pt-0">
                  <a [routerLink]="['/user/pesanan', p.id]" class="flex-1 md:flex-none text-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Detail</a>
                  <a *ngIf="p.status_bayar !== 'Lunas' && p.total_bayar > 0"
                     [routerLink]="['/user/bayar', p.id]" class="flex-1 md:flex-none text-center px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all">Bayar</a>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="flex flex-col gap-6">
          <div class="h-32 rounded-3xl bg-slate-200 animate-pulse" *ngFor="let i of [1,2,3]"></div>
        </div>
    </div>
  `,
  styles: []
})
export class UserDashboardComponent implements OnInit {
  data: any = null;
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getUserDashboard().subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user dashboard:', err);
        this.errorMsg = 'Gagal memuat data. Silakan coba lagi.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
