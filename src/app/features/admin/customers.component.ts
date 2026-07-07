import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 font-sans w-full max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-up">
        <div>
          <h1 class="text-3xl font-bold font-serif text-slate-800 mb-2">Data Pelanggan 👥</h1>
          <p class="text-slate-500">Kelola dan pantau aktivitas pelanggan Laundry Kinclong.</p>
        </div>
        <div class="flex gap-3 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100 w-full md:w-auto">
          <span class="material-icons text-slate-400 pl-2">search</span>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Cari nama atau telepon..." 
                 class="bg-transparent border-none outline-none w-full md:w-64 text-sm p-1">
        </div>
      </div>

      <div *ngIf="loading" class="animate-pulse flex flex-col gap-4">
        <div class="h-16 bg-slate-200 rounded-xl w-full" *ngFor="let i of [1,2,3,4,5]"></div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
        {{ errorMsg }}
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fade-up animate-stagger-1" *ngIf="!loading && !errorMsg">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th class="p-4 font-semibold whitespace-nowrap">Pelanggan</th>
                <th class="p-4 font-semibold whitespace-nowrap">Bergabung Sejak</th>
                <th class="p-4 font-semibold whitespace-nowrap text-center">Total Pesanan</th>
                <th class="p-4 font-semibold whitespace-nowrap text-center">Pesanan Selesai</th>
                <th class="p-4 font-semibold whitespace-nowrap text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filteredCustomers" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold text-sm">
                      {{ c.full_name?.charAt(0)?.toUpperCase() || 'P' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">{{ c.full_name || 'Tanpa Nama' }}</p>
                      <p class="text-xs text-slate-500 flex items-center gap-1">
                        <span class="material-icons text-[14px]">phone</span>
                        {{ c.phone || '-' }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-sm text-slate-600">{{ c.created_at | date:'dd MMM yyyy' }}</td>
                <td class="p-4 text-center">
                  <span class="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm">
                    {{ c.total_orders }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-sm">
                    {{ c.completed_orders }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <p class="font-bold text-primary">Rp {{ c.total_spent | number:'1.0-0' }}</p>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide">Status Lunas</p>
                </td>
              </tr>
              
              <tr *ngIf="filteredCustomers.length === 0">
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <span class="material-icons text-5xl text-slate-300 mb-3 block">group_off</span>
                  Tidak ada pelanggan yang ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  searchQuery = '';
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
    this.api.getAdminCustomers().subscribe({
      next: (res) => {
        console.log('Customers loaded:', res);
        this.customers = res.sort((a, b) => b.total_spent - a.total_spent);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.errorMsg = 'Gagal memuat data pelanggan. ' + (err.message || '');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredCustomers() {
    if (!this.searchQuery) return this.customers;
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(c => 
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  }
}
