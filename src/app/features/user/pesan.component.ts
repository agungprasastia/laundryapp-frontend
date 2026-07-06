import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-pesan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <h1>Buat Pesanan Baru</h1>

        <!-- Step indicator -->
        <div class="steps-indicator">
          <div class="step-dot" [class.active]="step >= 1" [class.current]="step === 1">1</div>
          <div class="step-line" [class.active]="step >= 2"></div>
          <div class="step-dot" [class.active]="step >= 2" [class.current]="step === 2">2</div>
          <div class="step-line" [class.active]="step >= 3"></div>
          <div class="step-dot" [class.active]="step >= 3" [class.current]="step === 3">3</div>
        </div>
        <div class="steps-labels">
          <span>Pilih Paket</span>
          <span>Detail</span>
          <span>Konfirmasi</span>
        </div>

        <!-- Step 1: Choose paket -->
        <div *ngIf="step === 1" class="step-content">
          <p class="step-desc">Pilih paket laundry yang Anda inginkan:</p>
          <div class="paket-grid">
            <div class="paket-option" *ngFor="let p of pakets"
                 [class.selected]="selectedPaket?.id === p.id"
                 (click)="selectPaket(p)">
              <div class="paket-icon">
                <span class="material-icons">dry_cleaning</span>
              </div>
              <h3>{{ p.nama_paket }}</h3>
              <p class="price">Rp {{ p.harga | number:'1.0-0' }}/kg</p>
              <p class="est" *ngIf="p.estimasi">{{ p.estimasi }}</p>
            </div>
          </div>
          <div class="step-actions">
            <button (click)="step = 2" [disabled]="!selectedPaket" class="btn-next">
              Lanjut <span class="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Detail -->
        <div *ngIf="step === 2" class="step-content">
          <p class="step-desc">Tambahkan catatan jika perlu:</p>
          <div class="selected-summary">
            <strong>{{ selectedPaket?.nama_paket }}</strong> — Rp {{ selectedPaket?.harga | number:'1.0-0' }}/kg
          </div>
          <div class="field">
            <label for="catatan">Catatan (opsional)</label>
            <textarea id="catatan" [(ngModel)]="catatan" rows="3" placeholder="Contoh: pisahkan warna putih..."></textarea>
          </div>
          <div class="step-actions">
            <button (click)="step = 1" class="btn-back">
              <span class="material-icons">arrow_back</span> Kembali
            </button>
            <button (click)="step = 3" class="btn-next">
              Lanjut <span class="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Confirm -->
        <div *ngIf="step === 3" class="step-content">
          <p class="step-desc">Konfirmasi pesanan Anda:</p>
          <div class="confirm-card">
            <div class="confirm-row"><span>Paket</span><strong>{{ selectedPaket?.nama_paket }}</strong></div>
            <div class="confirm-row"><span>Harga</span><strong>Rp {{ selectedPaket?.harga | number:'1.0-0' }}/kg</strong></div>
            <div class="confirm-row"><span>Estimasi</span><strong>{{ selectedPaket?.estimasi || '-' }}</strong></div>
            <div class="confirm-row" *ngIf="catatan"><span>Catatan</span><strong>{{ catatan }}</strong></div>
            <div class="confirm-note">
              <span class="material-icons">info</span>
              Berat dan total bayar akan dihitung setelah admin menimbang cucian Anda.
            </div>
          </div>
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <div class="step-actions">
            <button (click)="step = 2" class="btn-back">
              <span class="material-icons">arrow_back</span> Kembali
            </button>
            <button (click)="submit()" [disabled]="loading" class="btn-submit">
              {{ loading ? 'Mengirim...' : 'Kirim Pesanan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; min-height: 80vh; background: #f8fafc; }
    .container { max-width: 640px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .steps-indicator { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 8px; }
    .step-dot {
      width: 32px; height: 32px; border-radius: 50%; border: 2px solid #d1d5db;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; color: #9ca3af; background: white; transition: all 0.3s;
    }
    .step-dot.active { border-color: #0d9488; color: #0d9488; }
    .step-dot.current { background: #0d9488; color: white; }
    .step-line { flex: 1; max-width: 80px; height: 2px; background: #d1d5db; transition: background 0.3s; }
    .step-line.active { background: #0d9488; }
    .steps-labels { display: flex; justify-content: space-between; max-width: 320px; margin: 0 auto 32px; font-size: 12px; color: #64748b; }
    .step-content { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .step-desc { color: #64748b; margin-bottom: 20px; }
    .paket-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .paket-option {
      background: white; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px;
      text-align: center; cursor: pointer; transition: all 0.2s;
    }
    .paket-option:hover { border-color: #99f6e4; }
    .paket-option.selected { border-color: #0d9488; background: #f0fdfa; }
    .paket-icon .material-icons { font-size: 40px; color: #0d9488; }
    .paket-option h3 { font-size: 16px; font-weight: 700; margin: 12px 0 4px; color: #0f172a; }
    .paket-option .price { font-weight: 700; color: #0d9488; margin: 0; }
    .paket-option .est { font-size: 12px; color: #94a3b8; margin: 4px 0 0; }
    .selected-summary {
      background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 16px;
      margin-bottom: 20px; color: #0f172a; font-size: 14px;
    }
    .field { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    textarea {
      width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none; resize: vertical; box-sizing: border-box;
    }
    textarea:focus { border-color: #0d9488; }
    .confirm-card {
      background: white; border-radius: 16px; padding: 24px;
      border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .confirm-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .confirm-row span { color: #64748b; }
    .confirm-row strong { color: #0f172a; }
    .confirm-note {
      display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px;
      background: #fffbeb; border-radius: 8px; font-size: 13px; color: #92400e;
    }
    .confirm-note .material-icons { font-size: 18px; }
    .step-actions { display: flex; justify-content: space-between; margin-top: 28px; gap: 12px; }
    .btn-next, .btn-submit {
      display: inline-flex; align-items: center; gap: 6px; padding: 12px 28px;
      background: #0d9488; color: white; border: none; border-radius: 10px;
      font-weight: 600; cursor: pointer; transition: background 0.2s; margin-left: auto;
    }
    .btn-next:hover, .btn-submit:hover { background: #0f766e; }
    .btn-next:disabled, .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-back {
      display: inline-flex; align-items: center; gap: 6px; padding: 12px 20px;
      background: white; color: #64748b; border: 2px solid #e2e8f0; border-radius: 10px;
      font-weight: 600; cursor: pointer;
    }
    .error-msg { color: #dc2626; font-size: 13px; margin-top: 12px; text-align: center; }
  `]
})
export class PesanComponent implements OnInit {
  pakets: any[] = [];
  selectedPaket: any = null;
  catatan = '';
  step = 1;
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getPakets().subscribe(data => this.pakets = data);
  }

  selectPaket(p: any) { this.selectedPaket = p; }

  submit() {
    this.loading = true;
    this.error = '';
    this.api.createPesanan({ paket_id: this.selectedPaket.id, catatan: this.catatan }).subscribe({
      next: (data) => { this.router.navigate(['/user/pesanan', data.id]); },
      error: (err) => { this.error = err.error?.error || 'Gagal membuat pesanan'; this.loading = false; },
    });
  }
}
