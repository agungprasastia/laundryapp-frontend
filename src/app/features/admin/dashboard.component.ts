import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
    <div class="page">
      <h1>Dashboard Admin</h1>

      <div class="stats-grid" *ngIf="data">
        <app-stat-card label="Total Pesanan" [value]="data.stats.total_pesanan" icon="receipt_long" color="#0d9488"></app-stat-card>
        <app-stat-card label="Pesanan Baru" [value]="data.stats.pesanan_baru" icon="fiber_new" color="#3b82f6"></app-stat-card>
        <app-stat-card label="Sedang Proses" [value]="data.stats.pesanan_proses" icon="autorenew" color="#f59e0b"></app-stat-card>
        <app-stat-card label="Menunggu Verifikasi" [value]="data.stats.menunggu_verifikasi" icon="pending" color="#ef4444"></app-stat-card>
        <app-stat-card label="Pesanan Hari Ini" [value]="data.stats.pesanan_hari_ini" icon="today" color="#8b5cf6"></app-stat-card>
        <app-stat-card label="Total Pendapatan" [value]="'Rp ' + (data.stats.total_pendapatan | number:'1.0-0')" icon="payments" color="#059669"></app-stat-card>
      </div>

      <div class="chart-section" *ngIf="data">
        <h2>Pesanan & Pendapatan 7 Hari Terakhir</h2>
        <div class="chart-container">
          <canvas #chartCanvas></canvas>
        </div>
      </div>

      <div class="quick-links">
        <a routerLink="/admin/pesanan" class="quick-link">
          <span class="material-icons">list_alt</span> Kelola Pesanan
        </a>
        <a routerLink="/admin/pakets" class="quick-link">
          <span class="material-icons">inventory_2</span> Kelola Paket
        </a>
        <a routerLink="/admin/laporan" class="quick-link">
          <span class="material-icons">assessment</span> Laporan
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 28px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .chart-section { background: white; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .chart-container { position: relative; height: 300px; }
    .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .quick-link {
      display: flex; align-items: center; gap: 12px; padding: 20px; background: white;
      border-radius: 12px; text-decoration: none; color: #0f172a; font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; transition: all 0.2s;
    }
    .quick-link:hover { border-color: #0d9488; transform: translateY(-2px); }
    .quick-link .material-icons { font-size: 28px; color: #0d9488; }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  data: any = null;
  private chart: Chart | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAdminDashboard().subscribe(d => {
      this.data = d;
      setTimeout(() => this.renderChart(), 100);
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
