import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="font-sans">
      <!-- Hero -->
      <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface-dark via-white to-primary/5 py-20 px-6">
        <div class="absolute inset-0 w-full h-full">
           <div class="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -top-40 -left-20 animate-pulse" style="animation-duration: 8s"></div>
           <div class="absolute w-[500px] h-[500px] bg-accent/30 rounded-full blur-[100px] bottom-0 right-0 animate-pulse" style="animation-delay: 4s; animation-duration: 10s"></div>
        </div>

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary/20 text-primary font-semibold text-xs uppercase tracking-widest mb-8 shadow-sm">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Layanan Buka 24 Jam
            </div>
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight font-serif tracking-tight">
              Laundry <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600 italic font-serif">Kinclong</span>
            </h1>
            <p class="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              Solusi cucian bersih, wangi, dan rapi untuk gaya hidup modern Anda. Hemat waktu, serahkan pada ahlinya dengan teknologi pencucian mutakhir.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a routerLink="/register" class="btn btn-primary btn-lg shadow-xl shadow-primary/20">Mulai Sekarang</a>
              <a routerLink="/cek-status" class="btn btn-outline btn-lg bg-white/50 backdrop-blur-sm border-slate-200 text-slate-700 hover:border-primary">Cek Status Pesanan</a>
            </div>
            
            <!-- Trust Badges -->
            <div class="mt-12 pt-8 border-t border-slate-200 flex items-center gap-8">
              <div>
                <p class="text-3xl font-bold text-slate-900 font-serif">10k+</p>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Pelanggan Puas</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-slate-900 font-serif">4.9/5</p>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Rating Google</p>
              </div>
            </div>
          </div>
          
          <div class="relative hidden md:flex items-center justify-center h-[500px] lg:h-[600px]">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full animate-float blur-xl"></div>
            <div class="absolute w-24 h-24 bg-white shadow-xl shadow-primary/10 rounded-2xl flex items-center justify-center top-20 left-10 animate-float" style="animation-delay: 1s">
               <span class="material-icons text-4xl text-primary">eco</span>
            </div>
            <div class="absolute w-20 h-20 bg-white shadow-xl shadow-accent/20 rounded-2xl flex items-center justify-center bottom-32 right-10 animate-float" style="animation-delay: 2.5s">
               <span class="material-icons text-4xl text-accent">schedule</span>
            </div>
            <div class="relative w-80 h-80 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-2xl shadow-primary/30 animate-float" style="animation-duration: 8s">
              <span class="material-icons text-[140px] text-white drop-shadow-lg">local_laundry_service</span>
              <!-- Circular text or ring decoration can go here -->
              <div class="absolute inset-0 rounded-full border border-white/20 scale-[1.15]"></div>
              <div class="absolute inset-0 rounded-full border border-white/10 scale-[1.3]"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works (Cara Kerja) -->
      <section class="py-24 px-6 bg-primary text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>

        <div class="max-w-7xl mx-auto relative z-10 text-center">
          <h2 class="text-sm font-sans font-bold uppercase tracking-widest text-primary-100 mb-3">Proses Kami</h2>
          <h3 class="text-3xl md:text-4xl font-bold font-serif mb-16 text-white">Cara Kerja Kinclong</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="relative group">
              <div class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-white to-transparent opacity-20"></div>
              <div class="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:-translate-y-2 shadow-lg">
                <span class="material-icons text-3xl text-white group-hover:text-primary transition-colors">touch_app</span>
              </div>
              <h4 class="text-xl font-bold mb-2 text-white">1. Pesan Online</h4>
              <p class="text-primary-50 text-sm leading-relaxed px-4">Pilih paket layanan Anda melalui website dengan mudah dan cepat.</p>
            </div>
            
            <div class="relative group">
              <div class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-white to-transparent opacity-20"></div>
              <div class="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:-translate-y-2 shadow-lg">
                <span class="material-icons text-3xl text-white group-hover:text-primary transition-colors">local_shipping</span>
              </div>
              <h4 class="text-xl font-bold mb-2 text-white">2. Kami Jemput</h4>
              <p class="text-primary-50 text-sm leading-relaxed px-4">Kurir kami akan mengambil pakaian kotor langsung ke lokasi Anda.</p>
            </div>
            
            <div class="relative group">
              <div class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-white to-transparent opacity-20"></div>
              <div class="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:-translate-y-2 shadow-lg">
                <span class="material-icons text-3xl text-white group-hover:text-primary transition-colors">cleaning_services</span>
              </div>
              <h4 class="text-xl font-bold mb-2 text-white">3. Proses Cuci</h4>
              <p class="text-primary-50 text-sm leading-relaxed px-4">Pakaian dicuci dengan deterjen premium dan perlakuan khusus.</p>
            </div>
            
            <div class="relative group">
              <div class="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:-translate-y-2 shadow-lg">
                <span class="material-icons text-3xl text-white group-hover:text-primary transition-colors">check_circle</span>
              </div>
              <h4 class="text-xl font-bold mb-2 text-white">4. Antar Kembali</h4>
              <p class="text-primary-50 text-sm leading-relaxed px-4">Pakaian bersih, wangi, dan rapi dikirim kembali ke depan pintu Anda.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="py-24 px-6 bg-white relative z-20">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-3">Keunggulan</h2>
          <h3 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">Kenapa Memilih Kinclong?</h3>
          <p class="text-slate-500 max-w-2xl mx-auto mb-16">Kami berdedikasi memberikan kualitas terbaik dalam setiap helai pakaian Anda.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div class="group bg-surface-dark rounded-3xl p-8 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
              <div class="w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative z-10">
                <span class="material-icons text-2xl text-primary">speed</span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 mb-3 font-sans relative z-10">Cepat & Tepat Waktu</h4>
              <p class="text-slate-500 leading-relaxed text-sm relative z-10">Layanan express yang memastikan pakaian Anda siap dalam hitungan jam tanpa mengurangi kualitas pencucian.</p>
            </div>
            
            <div class="group bg-surface-dark rounded-3xl p-8 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
              <div class="w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative z-10">
                <span class="material-icons text-2xl text-primary">verified_user</span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 mb-3 font-sans relative z-10">Kualitas Terjamin</h4>
              <p class="text-slate-500 leading-relaxed text-sm relative z-10">Penggunaan deterjen premium dan penanganan spesifik untuk setiap jenis kain agar warna dan serat tetap terjaga.</p>
            </div>
            
            <div class="group bg-surface-dark rounded-3xl p-8 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
              <div class="w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative z-10">
                <span class="material-icons text-2xl text-primary">payments</span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 mb-3 font-sans relative z-10">Harga Transparan</h4>
              <p class="text-slate-500 leading-relaxed text-sm relative z-10">Memberikan nilai terbaik untuk uang Anda dengan tarif yang transparan tanpa biaya tersembunyi.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto text-center relative z-10">
          <h2 class="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-3">Testimoni</h2>
          <h3 class="text-3xl md:text-4xl font-bold text-slate-900 mb-16 font-serif">Apa Kata Mereka?</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div class="flex items-center gap-1 mb-4 text-yellow-400">
                <span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span>
              </div>
              <p class="text-slate-600 mb-6 italic text-sm leading-relaxed">"Sangat memuaskan! Pakaian saya yang kotor akibat noda lumpur bisa kembali bersih dan wangi seperti baru beli. Layanan antar-jemputnya sangat membantu saya yang sibuk kerja."</p>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                <div>
                  <p class="font-bold text-sm text-slate-900">Andi Pratama</p>
                  <p class="text-xs text-slate-500">Karyawan Swasta</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div class="flex items-center gap-1 mb-4 text-yellow-400">
                <span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span>
              </div>
              <p class="text-slate-600 mb-6 italic text-sm leading-relaxed">"Penyelamat di saat musim hujan! Hasil setrikaan sangat rapi dan lipatannya presisi. Wangi parfumnya juga elegan dan tahan lama di lemari pakaian."</p>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">B</div>
                <div>
                  <p class="font-bold text-sm text-slate-900">Bunga Citra</p>
                  <p class="text-xs text-slate-500">Ibu Rumah Tangga</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div class="flex items-center gap-1 mb-4 text-yellow-400">
                <span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star_half</span>
              </div>
              <p class="text-slate-600 mb-6 italic text-sm leading-relaxed">"Cuci sepatu premiumnya the best! Sepatu lari saya yang kusam kembali putih bersih tanpa merusak material. Harganya juga terjangkau dibanding tempat lain."</p>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">D</div>
                <div>
                  <p class="font-bold text-sm text-slate-900">Dimas Anggara</p>
                  <p class="text-xs text-slate-500">Mahasiswa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pakets (Preview) -->
      <section class="py-24 px-6 bg-white border-t border-slate-100" *ngIf="pakets.length">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 class="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-3">Pilihan Terbaik</h2>
              <h3 class="text-3xl md:text-4xl font-bold text-slate-900 font-serif">Paket Layanan Kami</h3>
            </div>
            <a routerLink="/pakets" class="text-primary font-bold hover:text-primary-600 flex items-center gap-1 group transition-colors">
              Lihat Semua Paket <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-surface-dark rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group" *ngFor="let p of pakets.slice(0,3)">
              <div class="relative h-48 overflow-hidden">
                <img *ngIf="p.foto_url" [src]="p.foto_url" [alt]="p.nama_paket" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div *ngIf="!p.foto_url" class="w-full h-full bg-gradient-to-br from-primary-50 to-accent/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span class="material-icons text-5xl text-primary/30">dry_cleaning</span>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm" *ngIf="p.estimasi">
                  ⏱ {{ p.estimasi }}
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-bold text-slate-900 mb-2 font-sans truncate">{{ p.nama_paket }}</h3>
                <div class="flex items-end gap-1 mb-4">
                  <span class="text-2xl font-bold text-primary">Rp {{ p.harga | number:'1.0-0' }}</span>
                  <span class="text-slate-400 font-medium mb-1 text-sm">/ {{ p.nama_paket.toLowerCase().includes('satuan') || p.nama_paket.toLowerCase().includes('sepatu') ? 'pcs' : 'kg' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="relative py-28 px-6 overflow-hidden">
        <div class="absolute inset-0 bg-primary"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-transparent opacity-80"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">Siap Untuk Beralih ke Kinclong?</h2>
          <p class="text-primary-50 text-lg mb-10 max-w-2xl mx-auto opacity-90">Jadwalkan penjemputan pertama Anda hari ini dan rasakan bedanya. Cepat, Bersih, dan Wangi.</p>
          <a routerLink="/register" class="btn bg-white text-primary hover:bg-slate-50 border-none px-10 py-4 text-base font-bold shadow-2xl hover:shadow-white/20 rounded-xl transition-all hover:-translate-y-1">Jadwalkan Penjemputan</a>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class LandingComponent implements OnInit {
  pakets: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPakets().subscribe(data => this.pakets = data);
  }
}
