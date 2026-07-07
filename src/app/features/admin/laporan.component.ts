import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-laporan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Laporan Keuangan</h1>

      <!-- Filters & Actions -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div class="flex flex-wrap items-end gap-4">
          <div class="field">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dari Tanggal</label>
            <input type="date" [(ngModel)]="dari" class="bg-white border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div class="field">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sampai Tanggal</label>
            <input type="date" [(ngModel)]="sampai" class="bg-white border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <button (click)="load()" class="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2">
            <span class="material-icons text-[18px]">filter_list</span> Terapkan Filter
          </button>
        </div>
        
        <button (click)="exportCSV()" *ngIf="data" class="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2">
          <span class="material-icons text-[18px]">download</span> Unduh Excel/CSV
        </button>
      </div>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="animate-fade-up">
        <div class="summary">
          <div class="sum-card animate-shimmer" style="height: 84px;" *ngFor="let i of [1,2]"></div>
        </div>
        <div class="chart-section animate-shimmer" style="height: 380px;"></div>
      </div>

      <!-- Summary -->
      <div class="summary animate-fade-up animate-stagger-1" *ngIf="data && !loading">
        <div class="sum-card interactive-hover">
          <span class="material-icons">payments</span>
          <div>
            <small>Total Pendapatan</small>
            <strong>Rp {{ data.total_pendapatan | number:'1.0-0' }}</strong>
          </div>
        </div>
        <div class="sum-card interactive-hover">
          <span class="material-icons">receipt_long</span>
          <div>
            <small>Total Pesanan Lunas</small>
            <strong>{{ data.total_pesanan }}</strong>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-section animate-fade-up animate-stagger-2" *ngIf="data?.detail_harian?.length && !loading">
        <h2>Grafik Pendapatan</h2>
        <div class="chart-container">
          <canvas #chartCanvas></canvas>
        </div>
      </div>

      <!-- Detail table -->
      <div class="table-wrap animate-fade-up animate-stagger-3" *ngIf="data?.detail_harian?.length && !loading">
        <h2>Detail Harian</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jumlah Pesanan</th>
              <th>Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of data.detail_harian">
              <td>{{ d.tanggal }}</td>
              <td>{{ d.jumlah }}</td>
              <td class="total">Rp {{ d.pendapatan | number:'1.0-0' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; max-width: 1000px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
    h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .filters { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 24px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
    .field input {
      padding: 8px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none;
    }
    .field input:focus { border-color: #0d9488; }
    .btn-filter, .btn-export {
      display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px;
      border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px;
    }
    .btn-filter { background: #0d9488; color: white; }
    .btn-filter:hover { background: #0f766e; }
    .btn-export { background: #f1f5f9; color: #374151; }
    .btn-export:hover { background: #e2e8f0; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .sum-card {
      display: flex; align-items: center; gap: 16px; padding: 24px; background: white;
      border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
    }
    .sum-card .material-icons { font-size: 36px; color: #0d9488; }
    .sum-card small { font-size: 13px; color: #64748b; }
    .sum-card strong { font-size: 24px; font-weight: 700; color: #0f172a; display: block; }
    .chart-section { background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .chart-container { height: 300px; position: relative; }
    .table-wrap { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px; text-align: left; font-weight: 600; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
    .total { font-weight: 700; color: #0d9488; }
  `]
})
export class AdminLaporanComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  data: any = null;
  dari = '';
  sampai = '';
  loading = true;
  private chart: Chart | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    // Default: last 30 days
    const now = new Date();
    this.sampai = now.toISOString().split('T')[0];
    const ago = new Date(now);
    ago.setDate(ago.getDate() - 30);
    this.dari = ago.toISOString().split('T')[0];
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.dari) params.dari = this.dari;
    if (this.sampai) params.sampai = this.sampai;
    this.api.getLaporan(params).subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(), 100);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  renderChart() {
    if (!this.chartCanvas || !this.data?.detail_harian?.length) return;
    if (this.chart) this.chart.destroy();
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.detail_harian.map((d: any) => d.tanggal),
        datasets: [{
          label: 'Pendapatan (Rp)',
          data: this.data.detail_harian.map((d: any) => d.pendapatan),
          backgroundColor: 'rgba(13,148,136,0.7)',
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  exportCSV() {
    if (!this.data?.detail_harian) return;
    const rows = [['Tanggal', 'Jumlah Pesanan', 'Pendapatan']];
    this.data.detail_harian.forEach((d: any) => rows.push([d.tanggal, d.jumlah, d.pendapatan]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_${this.dari}_${this.sampai}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
