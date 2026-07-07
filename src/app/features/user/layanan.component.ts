import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-layanan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 md:p-8 font-sans w-full max-w-7xl mx-auto">
      <div class="mb-8 animate-fade-up">
        <h1 class="text-3xl md:text-4xl font-bold font-serif text-slate-800 mb-2">Daftar Layanan 🏷️</h1>
        <p class="text-slate-500 text-lg">Pilih layanan cuci terbaik yang paling sesuai dengan kebutuhan Anda.</p>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="h-64 bg-slate-200 rounded-3xl animate-pulse" *ngFor="let i of [1,2,3,4,5,6]"></div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex flex-col gap-2">
        <span class="font-bold">{{ errorMsg }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!loading && !errorMsg">
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group animate-fade-up flex flex-col" 
             *ngFor="let p of pakets; let i = index" [style.animation-delay]="(i * 100) + 'ms'">
          <div class="h-48 bg-slate-100 relative overflow-hidden">
            <img *ngIf="p.foto_url" [src]="p.foto_url" [alt]="p.nama_paket" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <div *ngIf="!p.foto_url" class="w-full h-full flex items-center justify-center bg-primary-50">
              <span class="material-icons text-6xl text-primary-200">local_laundry_service</span>
            </div>
            <div class="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-primary shadow-sm">
              {{ p.estimasi || '2 Hari' }}
            </div>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-slate-800 mb-2 font-serif">{{ p.nama_paket }}</h3>
            <p class="text-slate-500 text-sm mb-6 flex-1">{{ p.deskripsi || 'Layanan profesional dengan detergen premium.' }}</p>
            
            <div class="flex items-center justify-between mt-auto">
              <div>
                <p class="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Harga mulai</p>
                <p class="text-2xl font-bold text-primary">Rp {{ p.harga | number:'1.0-0' }}<span class="text-sm font-normal text-slate-500">/kg</span></p>
              </div>
              <a routerLink="/user/pesan" [queryParams]="{ paket: p.id }" 
                 class="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300">
                <span class="material-icons">add_shopping_cart</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserLayananComponent implements OnInit {
  pakets: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
    this.api.getPakets().subscribe({
      next: (res) => {
        console.log('Pakets loaded:', res);
        this.pakets = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading pakets:', err);
        this.errorMsg = 'Gagal memuat daftar layanan. ' + (err.message || '');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
