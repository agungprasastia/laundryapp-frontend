import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-bayar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">
        <h1>Upload Bukti Bayar</h1>
        <p class="subtitle">Pesanan #{{ pesananId }}</p>

        <div class="upload-area" (click)="fileInput.click()"
             (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
             [class.has-file]="preview">
          <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" hidden />
          <div *ngIf="!preview" class="upload-placeholder">
            <span class="material-icons">cloud_upload</span>
            <p>Klik atau seret file bukti transfer</p>
            <small>JPEG, PNG, WebP — maks 5MB</small>
          </div>
          <img *ngIf="preview" [src]="preview" alt="Preview" class="preview-img" />
        </div>

        <div *ngIf="error" class="error-msg">{{ error }}</div>
        <div *ngIf="success" class="success-msg">{{ success }}</div>

        <button (click)="upload()" [disabled]="!file || loading" class="btn-submit">
          {{ loading ? 'Mengupload...' : 'Kirim Bukti Bayar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; min-height: 60vh; background: #f8fafc; }
    .container { max-width: 500px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .subtitle { color: #64748b; margin-bottom: 24px; }
    .upload-area {
      border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px; text-align: center;
      cursor: pointer; transition: border-color 0.2s; background: white;
    }
    .upload-area:hover { border-color: #0d9488; }
    .upload-area.has-file { border-style: solid; border-color: #0d9488; padding: 8px; }
    .upload-placeholder .material-icons { font-size: 48px; color: #94a3b8; }
    .upload-placeholder p { color: #64748b; margin: 8px 0 4px; }
    .upload-placeholder small { color: #94a3b8; }
    .preview-img { max-width: 100%; max-height: 300px; border-radius: 12px; }
    .error-msg { color: #dc2626; margin-top: 12px; font-size: 14px; text-align: center; }
    .success-msg { color: #059669; margin-top: 12px; font-size: 14px; text-align: center; }
    .btn-submit {
      display: block; width: 100%; padding: 14px; margin-top: 20px;
      background: #0d9488; color: white; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    .btn-submit:hover { background: #0f766e; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class BayarComponent {
  pesananId: number;
  file: File | null = null;
  preview: string | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.pesananId = +this.route.snapshot.params['id'];
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
    this.file = f;
    const reader = new FileReader();
    reader.onload = (e) => this.preview = e.target?.result as string;
    reader.readAsDataURL(f);
  }

  upload() {
    if (!this.file) return;
    this.loading = true;
    this.error = '';
    this.api.uploadBuktiBayar(this.pesananId, this.file).subscribe({
      next: () => {
        this.success = 'Bukti bayar berhasil diupload!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/user/pesanan', this.pesananId]), 1500);
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengupload';
        this.loading = false;
      },
    });
  }
}
