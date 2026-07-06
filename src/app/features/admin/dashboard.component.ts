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
    <div class="min-h-screen bg-slate-50 p-6 md:p-8 font-sans">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-lg shadow-primary/20 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div class="relative z-10">
            <h1 class="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">Halo, Admin! 👋</h1>
            <p class="text-primary-100 text-lg">Berikut adalah ringkasan performa Laundry Kinclong hari ini.</p>
          </div>
        </div>

        <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 mb-8 flex items-center gap-2">
          <span class="material-icons">error_outline</span> {{ errorMsg }}
        </div>

        <div *ngIf="loading" class="flex items-center justify-center p-12">
          <span class="material-icons animate-spin text-primary text-4xl">refresh</span>
        </div>

        <div *ngIf="data && !loading">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <app-stat-card label="Total Pesanan" [value]="data.stats.total_pesanan" icon="receipt_long" color="#0d9488"></app-stat-card>
            <app-stat-card label="Pesanan Baru" [value]="data.stats.pesanan_baru" icon="fiber_new" color="#3b82f6"></app-stat-card>
            <app-stat-card label="Sedang Proses" [value]="data.stats.pesanan_proses" icon="autorenew" color="#f59e0b"></app-stat-card>
            <app-stat-card label="Menunggu Verifikasi" [value]="data.stats.menunggu_verifikasi" icon="pending" color="#ef4444"></app-stat-card>
            <app-stat-card label="Pesanan Hari Ini" [value]="data.stats.pesanan_hari_ini" icon="today" color="#8b5cf6"></app-stat-card>
            <app-stat-card label="Total Pendapatan" [value]="'Rp ' + (data.stats.total_pendapatan | number:'1.0-0')" icon="payments" color="#059669"></app-stat-card>
          </div>

          <!-- Chart & Quick Links -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Chart Section -->
            <div class="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-slate-800 font-sans">Performa 7 Hari Terakhir</h2>
                <span class="material-icons text-slate-400">trending_up</span>
              </div>
              <div class="relative h-[320px] w-full">
                <canvas #chartCanvas></canvas>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 class="text-xl font-bold text-slate-800 font-sans mb-6">Akses Cepat</h2>
              <div class="flex flex-col gap-4">
                <a routerLink="/admin/pesanan" class="group flex items-center p-4 bg-slate-50 hover:bg-primary-50 rounded-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 hover:-translate-y-1 hover:shadow-md">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                    <span class="material-icons text-slate-600 group-hover:text-white transition-colors">list_alt</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Kelola Pesanan</h3>
                    <p class="text-xs text-slate-500">Lihat & update status</p>
                  </div>
                  <span class="material-icons text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </a>

                <a routerLink="/admin/pakets" class="group flex items-center p-4 bg-slate-50 hover:bg-primary-50 rounded-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 hover:-translate-y-1 hover:shadow-md">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                    <span class="material-icons text-slate-600 group-hover:text-white transition-colors">inventory_2</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Kelola Paket</h3>
                    <p class="text-xs text-slate-500">Tambah & edit layanan</p>
                  </div>
                  <span class="material-icons text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </a>

                <a routerLink="/admin/laporan" class="group flex items-center p-4 bg-slate-50 hover:bg-primary-50 rounded-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 hover:-translate-y-1 hover:shadow-md">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                    <span class="material-icons text-slate-600 group-hover:text-white transition-colors">assessment</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Laporan Keuangan</h3>
                    <p class="text-xs text-slate-500">Export PDF laporan</p>
                  </div>
                  <span class="material-icons text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </a>
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
