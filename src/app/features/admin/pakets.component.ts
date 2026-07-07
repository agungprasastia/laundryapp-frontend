import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-pakets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="header animate-fade-up">
        <h1>Kelola Paket</h1>
        <button (click)="openForm()" class="btn-primary">
          <span class="material-icons">add</span> Tambah Paket
        </button>
      </div>

      <!-- Form modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="showForm = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{ editing ? 'Edit' : 'Tambah' }} Paket</h2>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="field">
              <label>Nama Paket</label>
              <input formControlName="nama_paket" placeholder="Cuci Reguler" />
            </div>
            <div class="field">
              <label>Harga per kg (Rp)</label>
              <input type="number" formControlName="harga" placeholder="5000" />
            </div>
            <div class="field">
              <label>Estimasi</label>
              <input formControlName="estimasi" placeholder="2-3 hari" />
            </div>
            <div class="field">
              <label>Deskripsi</label>
              <textarea formControlName="deskripsi" rows="2" placeholder="Deskripsi singkat..."></textarea>
            </div>
            <div class="field">
              <label>Foto Paket</label>
              <input type="file" accept="image/*" (change)="onFileSelect($event)" />
            </div>
            <div *ngIf="error" class="error-msg">{{ error }}</div>
            <div class="modal-actions">
              <button type="button" (click)="showForm = false" class="btn-cancel">Batal</button>
              <button type="submit" [disabled]="form.invalid || saving" class="btn-save">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="paket-grid animate-fade-up">
        <div class="paket-card animate-shimmer" *ngFor="let i of [1,2,3]" style="height: 290px;"></div>
      </div>

      <!-- List -->
      <div class="paket-grid" *ngIf="!loading">
        <div class="paket-card animate-fade-up interactive-hover" *ngFor="let p of pakets; let i = index" [style.animation-delay]="(i * 100) + 'ms'">
          <img *ngIf="p.foto_url" [src]="p.foto_url" class="paket-img" />
          <div *ngIf="!p.foto_url" class="paket-img placeholder">
            <span class="material-icons">dry_cleaning</span>
          </div>
          <div class="paket-body">
            <h3>{{ p.nama_paket }}</h3>
            <p class="price">Rp {{ p.harga | number:'1.0-0' }}/kg</p>
            <p class="est" *ngIf="p.estimasi">{{ p.estimasi }}</p>
            <div class="actions">
              <button (click)="edit(p)" class="btn-sm edit"><span class="material-icons">edit</span></button>
              <button (click)="confirmDelete(p)" class="btn-sm delete"><span class="material-icons">delete</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px 5vw; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
    h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px;
      background: #0d9488; color: white; border: none; border-radius: 10px;
      font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    .btn-primary:hover { background: #0f766e; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex;
      align-items: center; justify-content: center; z-index: 100; padding: 20px;
    }
    .modal {
      background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 480px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15); animation: slideUp 0.3s;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .modal h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
    .field { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    input, textarea {
      width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none; box-sizing: border-box;
    }
    input:focus, textarea:focus { border-color: #0d9488; }
    .error-msg { color: #dc2626; font-size: 13px; margin-bottom: 8px; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .btn-cancel { padding: 10px 20px; background: #f1f5f9; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; color: #64748b; }
    .btn-save { padding: 10px 24px; background: #0d9488; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
    .btn-save:disabled { opacity: 0.5; }

    .paket-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .paket-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .paket-img { width: 100%; height: 160px; object-fit: cover; }
    .paket-img.placeholder { display: flex; align-items: center; justify-content: center; background: #f0fdfa; }
    .paket-img.placeholder .material-icons { font-size: 48px; color: #0d9488; opacity: 0.3; }
    .paket-body { padding: 16px; }
    .paket-body h3 { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
    .price { font-weight: 700; color: #0d9488; margin: 0 0 4px; }
    .est { font-size: 13px; color: #94a3b8; margin: 0 0 12px; }
    .actions { display: flex; gap: 8px; }
    .btn-sm {
      width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center; cursor: pointer; background: white;
    }
    .btn-sm .material-icons { font-size: 18px; }
    .btn-sm.edit:hover { background: #f0fdfa; color: #0d9488; }
    .btn-sm.delete:hover { background: #fef2f2; color: #dc2626; }
  `]
})
export class AdminPaketsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  pakets: any[] = [];
  showForm = false;
  editing: any = null;
  saving = false;
  loading = true;
  error = '';
  foto: File | null = null;

  form = this.fb.group({
    nama_paket: ['', Validators.required],
    harga: [0, [Validators.required, Validators.min(1)]],
    estimasi: [''],
    deskripsi: [''],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAdminPakets().subscribe({
      next: d => {
        this.pakets = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm() {
    this.editing = null;
    this.form.reset({ nama_paket: '', harga: 0, estimasi: '', deskripsi: '' });
    this.foto = null;
    this.error = '';
    this.showForm = true;
  }

  edit(p: any) {
    this.editing = p;
    this.form.patchValue(p);
    this.foto = null;
    this.error = '';
    this.showForm = true;
  }

  onFileSelect(event: any) {
    this.foto = event.target.files[0] || null;
  }

  save() {
    this.saving = true;
    this.error = '';
    const fd = new FormData();
    fd.append('nama_paket', this.form.value.nama_paket!);
    fd.append('harga', String(this.form.value.harga));
    fd.append('estimasi', this.form.value.estimasi || '');
    fd.append('deskripsi', this.form.value.deskripsi || '');
    if (this.foto) fd.append('foto', this.foto);

    const req = this.editing
      ? this.api.updatePaket(this.editing.id, fd)
      : this.api.createPaket(fd);

    req.subscribe({
      next: () => { this.showForm = false; this.saving = false; this.load(); },
      error: (err) => { this.error = err.error?.error || 'Gagal menyimpan'; this.saving = false; },
    });
  }

  confirmDelete(p: any) {
    if (confirm(`Hapus paket "${p.nama_paket}"?`)) {
      this.api.deletePaket(p.id).subscribe(() => this.load());
    }
  }
}
