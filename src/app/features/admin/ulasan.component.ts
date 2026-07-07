import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-ulasan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-8 font-sans w-full max-w-7xl mx-auto">
      <div class="mb-8 animate-fade-up">
        <h1 class="text-3xl font-bold font-serif text-slate-800 mb-2">Ulasan Pelanggan ⭐</h1>
        <p class="text-slate-500">Lihat semua *rating* dan testimoni yang diberikan oleh pelanggan.</p>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div class="h-40 bg-slate-200 rounded-2xl w-full" *ngFor="let i of [1,2,3,4,5,6]"></div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
        {{ errorMsg }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!loading && !errorMsg">
        <div *ngFor="let r of ulasan; let i = index" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow animate-fade-up" [style.animation-delay]="(i * 50) + 'ms'">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold text-sm">
                {{ r.nama_pelanggan?.charAt(0)?.toUpperCase() || 'P' }}
              </div>
              <div>
                <p class="font-bold text-slate-800">{{ r.nama_pelanggan || 'Pelanggan' }}</p>
                <p class="text-xs text-slate-500">{{ r.created_at | date:'dd MMM yyyy, HH:mm' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400 font-bold mb-1">Pesanan #{{ r.pesanan_id }}</p>
            </div>
          </div>
          
          <div class="flex gap-1 mb-3">
            <span class="material-icons text-xl" *ngFor="let s of [1,2,3,4,5]" 
                  [ngClass]="s <= r.rating ? 'text-yellow-400' : 'text-slate-200'">
              star
            </span>
          </div>
          
          <p class="text-slate-600 text-sm italic">
            "{{ r.ulasan || 'Tidak ada teks ulasan.' }}"
          </p>
        </div>

        <div *ngIf="ulasan.length === 0" class="col-span-full text-center p-12 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <span class="material-icons text-5xl text-slate-300 mb-3 block">speaker_notes_off</span>
          Belum ada ulasan dari pelanggan.
        </div>
      </div>
    </div>
  `
})
export class AdminUlasanComponent implements OnInit {
  ulasan: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getAdminUlasan().subscribe({
      next: (res) => {
        this.ulasan = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Gagal memuat ulasan pelanggan.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}
