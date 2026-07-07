import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  template: `
    <div class="p-6 md:p-8 font-sans w-full max-w-7xl mx-auto">
      
      <!-- Header Banner -->
      <div class="animate-fade-up bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-lg shadow-primary/20 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-1000 group-hover:scale-150"></div>
        <div class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">Halo, Admin! 👋</h1>
          <p class="text-primary-100 text-lg">Berikut adalah ringkasan performa Laundry Kinclong hari ini.</p>
        </div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 mb-8 flex items-center gap-2">
        <span class="material-icons">error_outline</span> {{ errorMsg }}
      </div>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="animate-fade-up">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="h-[104px] rounded-xl animate-shimmer"></div>
        </div>
        <div class="h-[432px] rounded-3xl animate-shimmer"></div>
      </div>

      <div *ngIf="data && !loading">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <app-stat-card class="animate-fade-up animate-stagger-1" label="Total Pesanan" [value]="data.stats.total_pesanan" icon="receipt_long" color="#0d9488"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-2" label="Pesanan Baru" [value]="data.stats.pesanan_baru" icon="fiber_new" color="#3b82f6"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-3" label="Sedang Proses" [value]="data.stats.pesanan_proses" icon="autorenew" color="#f59e0b"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-4" label="Verifikasi" [value]="data.stats.menunggu_verifikasi" icon="pending" color="#ef4444"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-5" label="Pesanan Hari Ini" [value]="data.stats.pesanan_hari_ini" icon="today" color="#8b5cf6"></app-stat-card>
          <app-stat-card class="animate-fade-up animate-stagger-6" label="Total Pendapatan" [value]="'Rp ' + (data.stats.total_pendapatan | number:'1.0-0')" icon="payments" color="#059669"></app-stat-card>
        </div>

        <!-- Grid Layout for Chart & Recent Orders -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          
          <!-- Chart Section -->
          <div class="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-fade-up animate-stagger-2">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800 font-sans">Performa 7 Hari Terakhir</h2>
              <span class="material-icons text-slate-400">trending_up</span>
            </div>
            <div class="relative h-[360px] w-full">
              <canvas #chartCanvas></canvas>
            </div>
          </div>

          <!-- Quick Actions / Recent Orders -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-fade-up animate-stagger-3 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800 font-sans">Pesanan Terbaru</h2>
              <a routerLink="/admin/pesanan" class="text-sm text-primary font-bold hover:underline">Lihat Semua</a>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-2">
              <div *ngIf="!data.recent_orders?.length" class="text-center text-slate-500 py-8">
                <span class="material-icons text-4xl mb-2 text-slate-300">inbox</span>
                <p>Belum ada pesanan terbaru.</p>
              </div>

              <div class="flex flex-col gap-4">
                <div *ngFor="let o of data.recent_orders" class="p-4 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-primary-50 transition-colors group cursor-pointer" routerLink="/admin/pesanan">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-bold text-slate-800 leading-tight">#{{ o.id }}</p>
                      <p class="text-xs text-slate-500">{{ o.user_id?.full_name || 'Pelanggan' }}</p>
                    </div>
                    <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          [ngClass]="{
                            'bg-blue-100 text-blue-700': o.status === 'Baru',
                            'bg-amber-100 text-amber-700': o.status === 'Proses',
                            'bg-emerald-100 text-emerald-700': o.status === 'Selesai' || o.status === 'Diambil',
                            'bg-slate-100 text-slate-700': !['Baru','Proses','Selesai','Diambil'].includes(o.status)
                          }">
                      {{ o.status }}
                    </span>
                  </div>
                  <div class="flex justify-between items-end mt-3">
                    <p class="text-xs font-medium text-slate-500 truncate max-w-[120px]" [title]="o.pakets?.nama_paket">{{ o.pakets?.nama_paket }}</p>
                    <p class="text-sm font-bold text-primary">Rp {{ o.total_bayar | number:'1.0-0' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  data: any = null;
  chart: Chart | null = null;
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loading = true;
    this.api.getAdminDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(), 100);
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.errorMsg = 'Gagal memuat data dari server. Pastikan Anda memiliki akses atau koneksi internet stabil.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  renderChart() {
    if (!this.chartCanvas || !this.data?.chartData) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const labels = this.data.chartData.map((d: any) => d.tanggal.slice(5)); // MM-DD
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Jumlah Pesanan',
            data: this.data.chartData.map((d: any) => d.jumlah),
            backgroundColor: 'rgba(13,148,136,0.7)',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'Pendapatan (Rp)',
            data: this.data.chartData.map((d: any) => d.pendapatan),
            type: 'line',
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.1)',
            fill: true,
            tension: 0.3,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { position: 'left', beginAtZero: true, title: { display: true, text: 'Pesanan' } },
          y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Rp' } },
        },
      },
    });
  }
}
