import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-bayar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container animate-fade-up">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <!-- Informasi Pembayaran -->
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
            <h1 class="text-2xl font-bold font-serif text-slate-800 mb-2">Instruksi Pembayaran</h1>
            <p class="text-slate-500 mb-6 text-sm">Selesaikan pembayaran untuk Pesanan <strong class="text-primary">#{{ pesananId }}</strong></p>
            
            <div *ngIf="pesanan" class="mb-8 p-5 bg-primary-50 rounded-2xl border border-primary-100 flex justify-between items-center relative overflow-hidden">
              <div class="absolute right-0 top-0 w-24 h-24 bg-primary-100/50 rounded-bl-full -z-10"></div>
              <div>
                <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Total Tagihan</p>
                <p class="text-3xl font-black text-primary-800 tracking-tight">Rp {{ pesanan.total_bayar | number:'1.0-0' }}</p>
              </div>
              <span class="material-icons text-4xl text-primary-200">account_balance_wallet</span>
            </div>
            
            <div *ngIf="loadingDetail" class="animate-pulse flex space-x-4 mb-8">
              <div class="h-24 bg-slate-100 rounded-2xl w-full"></div>
            </div>

            <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
               Pilih Metode Pembayaran
            </h3>
            
            <div class="space-y-3">
              <!-- BCA -->
              <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:border-primary-300 transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-blue-600 italic border border-slate-100">BCA</div>
                  <div>
                    <p class="font-bold text-slate-800 tracking-wide leading-tight">8720 1234 5678</p>
                    <p class="text-xs text-slate-500 mt-0.5">a.n. Laundry Kinclong</p>
                  </div>
                </div>
                <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border"
                        [ngClass]="copiedText === '872012345678' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary hover:border-primary-100 border-slate-100'"
                        (click)="copyText('872012345678')">
                  <span class="material-icons text-[16px]">{{ copiedText === '872012345678' ? 'check' : 'content_copy' }}</span> 
                  {{ copiedText === '872012345678' ? 'Tersalin' : 'Salin' }}
                </button>
              </div>
              
              <!-- Mandiri -->
              <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:border-primary-300 transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-yellow-500 italic border border-slate-100">MDR</div>
                  <div>
                    <p class="font-bold text-slate-800 tracking-wide leading-tight">1370 0000 0000</p>
                    <p class="text-xs text-slate-500 mt-0.5">a.n. Laundry Kinclong</p>
                  </div>
                </div>
                <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border"
                        [ngClass]="copiedText === '137000000000' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary hover:border-primary-100 border-slate-100'"
                        (click)="copyText('137000000000')">
                  <span class="material-icons text-[16px]">{{ copiedText === '137000000000' ? 'check' : 'content_copy' }}</span> 
                  {{ copiedText === '137000000000' ? 'Tersalin' : 'Salin' }}
                </button>
              </div>
              
              <!-- QRIS / E-Wallet -->
              <div class="rounded-2xl border border-slate-200 bg-white hover:border-primary-300 transition-colors overflow-hidden group">
                <div class="flex items-center justify-between p-4 cursor-pointer" (click)="showQR = !showQR">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 transition-colors">
                      <span class="material-icons text-2xl text-slate-400 group-hover:text-primary">qr_code_scanner</span>
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 tracking-wide mb-0.5">Scan QRIS</p>
                      <div class="flex flex-wrap gap-1">
                        <span class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Gopay</span>
                        <span class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">OVO</span>
                        <span class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">DANA</span>
                      </div>
                    </div>
                  </div>
                  <button class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary transition-colors border border-slate-100">
                    <span class="material-icons transition-transform duration-300" [ngStyle]="{'transform': showQR ? 'rotate(180deg)' : 'rotate(0)'}">expand_more</span>
                  </button>
                </div>
                
                <!-- Expanded QR Area -->
                <div *ngIf="showQR" class="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-center justify-center">
                  <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex items-center justify-center">
                    <span class="material-icons text-[220px] text-slate-800 leading-none">qr_code_2</span>
                  </div>
                  <p class="text-sm font-bold text-slate-800">Scan QR Code di Atas</p>
                  <p class="text-xs text-slate-500 text-center mt-1">Buka aplikasi E-Wallet atau M-Banking Anda</p>
                </div>
              </div>
            </div>
            
          </div>

          <!-- Form Upload -->
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-fit">
            <div>
              <h2 class="text-xl font-bold text-slate-800 mb-2">Konfirmasi Pembayaran</h2>
              <p class="text-slate-500 mb-6 text-sm">Upload foto bukti transfer Anda di sini.</p>
              
              <div class="upload-area group" (click)="fileInput.click()"
                   (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
                   [class.has-file]="preview">
                <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" hidden />
                
                <div *ngIf="!preview" class="upload-placeholder">
                  <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary-50 transition-all">
                    <span class="material-icons text-3xl text-slate-400 group-hover:text-primary transition-colors">cloud_upload</span>
                  </div>
                  <p class="font-bold text-slate-700 text-sm">Klik atau seret foto kemari</p>
                  <small class="text-slate-400 font-medium block mt-1">JPEG, PNG (maks 5MB)</small>
                </div>
                
                <div *ngIf="preview" class="relative group/preview">
                  <img [src]="preview" alt="Preview" class="preview-img shadow-sm" />
                  <div class="absolute inset-0 bg-slate-900/30 rounded-xl opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
                    <div class="flex flex-col items-center gap-1">
                      <span class="material-icons text-2xl">change_circle</span>
                      <span class="text-sm font-bold">Ganti Foto</span>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="error" class="bg-red-50 text-red-600 p-3 rounded-xl mt-4 text-sm font-medium flex items-center gap-2 border border-red-100">
                <span class="material-icons text-[18px]">error</span> {{ error }}
              </div>
              <div *ngIf="success" class="bg-emerald-50 text-emerald-600 p-3 rounded-xl mt-4 text-sm font-medium flex items-center gap-2 border border-emerald-100">
                <span class="material-icons text-[18px]">check_circle</span> {{ success }}
              </div>
            </div>

            <div class="mt-6">
              <button (click)="upload()" [disabled]="!file || loading" 
                      class="w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed"
                      [ngClass]="(!file || loading) ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-primary-600 shadow-sm shadow-primary/20'">
                <span *ngIf="!loading" class="material-icons text-[18px]">send</span>
                <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Mengupload...' : 'Kirim Bukti Pembayaran' }}
              </button>
              
              <button class="w-full py-3 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl mt-3 hover:bg-slate-50 active:scale-[0.98] transition-all" (click)="goBack()">Kembali</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; min-height: 80vh; background: #f8fafc; }
    .container { max-width: 1000px; margin: 0 auto; }
    
    .upload-area {
      border: 2px dashed #cbd5e1; border-radius: 20px; padding: 40px 20px; text-align: center;
      cursor: pointer; transition: all 0.3s ease; background: #f8fafc;
    }
    .upload-area:hover { border-color: #0d9488; background: #f0fdfa; }
    .upload-area.has-file { border-style: solid; border-color: #0d9488; padding: 12px; background: white; }
    .preview-img { max-width: 100%; max-height: 400px; border-radius: 12px; object-fit: contain; margin: 0 auto; display: block; }
  `]
})
export class BayarComponent implements OnInit {
  pesananId: number;
  pesanan: any = null;
  file: File | null = null;
  preview: string | null = null;
  loading: boolean = false;
  loadingDetail: boolean = true;
  error: string = '';
  success: string = '';
  copiedText: string = '';
  showQR: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private api: ApiService, 
    private cdr: ChangeDetectorRef
  ) {
    this.pesananId = +this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.api.getPesanan(this.pesananId).subscribe({
      next: (d) => {
        this.pesanan = d;
        this.loadingDetail = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDetail = false;
        this.cdr.detectChanges();
      }
    });
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedText = text;
      setTimeout(() => {
        this.copiedText = '';
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  goBack() {
    this.router.navigate(['/user/pesanan', this.pesananId]);
  }

  onFileSelect(event: any) {
    const f = event.target.files[0];
    if (f) this.setFile(f);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const f = event.dataTransfer?.files[0];
    if (f) this.setFile(f);
  }

  private setFile(f: File) {
    // Basic validation
    if (f.size > 5 * 1024 * 1024) {
      this.error = 'Ukuran file melebihi 5MB';
      return;
    }
    this.error = '';
    this.file = f;
    const reader = new FileReader();
    reader.onload = (e) => { 
      this.preview = e.target?.result as string; 
      this.cdr.detectChanges(); 
    };
    reader.readAsDataURL(f);
  }

  upload() {
    if (!this.file) return;
    this.loading = true;
    this.error = '';
    this.api.uploadBuktiBayar(this.pesananId, this.file).subscribe({
      next: () => {
        this.success = 'Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/user/pesanan', this.pesananId]), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengupload bukti bayar.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
