import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-8 font-sans w-full max-w-4xl mx-auto">
      <div class="text-center mb-10 animate-fade-up">
        <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-4xl text-primary">support_agent</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold font-serif text-slate-800 mb-2">Pusat Bantuan</h1>
        <p class="text-slate-500 text-lg">Ada pertanyaan atau kendala? Kami siap membantu Anda.</p>
      </div>

      <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 animate-fade-up animate-stagger-1 mb-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span class="material-icons text-primary">live_help</span> Pertanyaan Umum (FAQ)
        </h2>
        
        <div class="flex flex-col gap-4">
          <!-- FAQ 1 -->
          <div class="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer group" (click)="openFaq = openFaq === 1 ? 0 : 1">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Berapa lama estimasi pengerjaan laundry?</h3>
              <span class="material-icons text-slate-400 transition-transform duration-300" [class.rotate-180]="openFaq === 1">expand_more</span>
            </div>
            <div class="text-slate-600 mt-3 text-sm leading-relaxed" *ngIf="openFaq === 1" class="animate-fadeIn">
              Estimasi pengerjaan berbeda untuk setiap layanan. Cuci Reguler biasanya memakan waktu 2-3 hari kerja. Layanan Kilat bisa selesai dalam 1 hari atau 24 jam.
            </div>
          </div>

          <!-- FAQ 2 -->
          <div class="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer group" (click)="openFaq = openFaq === 2 ? 0 : 2">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Apakah menyediakan layanan antar-jemput?</h3>
              <span class="material-icons text-slate-400 transition-transform duration-300" [class.rotate-180]="openFaq === 2">expand_more</span>
            </div>
            <div class="text-slate-600 mt-3 text-sm leading-relaxed" *ngIf="openFaq === 2" class="animate-fadeIn">
              Saat ini kami mendukung layanan antar-jemput untuk radius maksimal 5KM dari lokasi toko kami. Biaya kurir mungkin berlaku tergantung jarak.
            </div>
          </div>
          
          <!-- FAQ 3 -->
          <div class="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer group" (click)="openFaq = openFaq === 3 ? 0 : 3">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 group-hover:text-primary transition-colors">Bagaimana jika pakaian luntur atau rusak?</h3>
              <span class="material-icons text-slate-400 transition-transform duration-300" [class.rotate-180]="openFaq === 3">expand_more</span>
            </div>
            <div class="text-slate-600 mt-3 text-sm leading-relaxed" *ngIf="openFaq === 3" class="animate-fadeIn">
              Kepuasan pelanggan adalah prioritas kami. Kami memisahkan cucian luntur dan putih. Namun, jika terjadi kelalaian dari pihak kami yang menyebabkan kerusakan, kami akan memberikan ganti rugi sesuai syarat dan ketentuan yang berlaku.
            </div>
          </div>
        </div>
      </div>

      <!-- Hubungi Kami -->
      <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-10 text-white shadow-lg shadow-emerald-500/20 animate-fade-up animate-stagger-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-bold font-serif mb-2">Masih Butuh Bantuan?</h2>
          <p class="text-emerald-50">Admin kami siap membantu Anda menjawab segala pertanyaan seputar layanan Kinclong.</p>
        </div>
        <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Kinclong,%20saya%20butuh%20bantuan." target="_blank" 
           class="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md">
          <span class="material-icons">whatsapp</span> Hubungi WhatsApp
        </a>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn { animation: fadeIn 0.3s ease-in-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class UserFaqComponent {
  openFaq = 1;
}
