import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-800 font-sans tracking-tight">Profil Saya</h1>
        <p class="text-slate-500 mt-2">Kelola informasi data diri dan pengaturan akun Anda.</p>
      </div>

      <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 animate-fade-up">
        
        <div class="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
          <div class="relative group">
            <div *ngIf="!uploadedAvatarUrl" class="w-24 h-24 rounded-full bg-primary-50 text-primary flex items-center justify-center text-4xl font-bold shadow-inner">
              {{ getInitials() }}
            </div>
            <img *ngIf="uploadedAvatarUrl" [src]="uploadedAvatarUrl" class="w-24 h-24 rounded-full object-cover shadow-inner" />
            <label class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span class="material-icons text-white">photo_camera</span>
              <input type="file" accept="image/*" class="hidden" (change)="onAvatarSelected($event)">
            </label>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-slate-800">{{ profile?.full_name || 'Memuat...' }}</h2>
            <p class="text-slate-500 flex items-center gap-2 mt-1">
              <span class="material-icons text-[18px]">email</span>
              {{ profile?.email || '...' }}
            </p>
            <span class="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg">
              {{ profile?.role === 'admin' ? 'Administrator' : 'Pelanggan' }}
            </span>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-[20px]">person</span>
                <input type="text" formControlName="full_name"
                       class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                       [class.border-red-500]="form.get('full_name')?.invalid && form.get('full_name')?.touched" />
              </div>
              <p *ngIf="form.get('full_name')?.invalid && form.get('full_name')?.touched" class="text-red-500 text-xs mt-2 font-medium">
                Nama lengkap wajib diisi
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon / WhatsApp</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-[20px]">call</span>
                <input type="text" formControlName="phone"
                       class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
            </div>
            
            <!-- Email (Readonly) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-slate-700 mb-2">Email (Tidak dapat diubah)</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-[20px]">email</span>
                <input type="email" [value]="profile?.email" disabled
                       class="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
              </div>
            </div>
          </div>

          <!-- Alert Messages -->
          <div *ngIf="successMsg" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-start gap-3 animate-fade-up">
            <span class="material-icons text-emerald-500">check_circle</span>
            <div>
              <p class="font-bold">Berhasil Disimpan!</p>
              <p class="text-sm mt-1">{{ successMsg }}</p>
            </div>
          </div>

          <div *ngIf="errorMsg" class="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3 animate-fade-up">
            <span class="material-icons text-red-500">error</span>
            <div>
              <p class="font-bold">Gagal Menyimpan</p>
              <p class="text-sm mt-1">{{ errorMsg }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end pt-6 border-t border-slate-100">
            <button type="submit" [disabled]="form.invalid || loading"
                    class="bg-primary hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 min-w-[160px]">
              <span *ngIf="loading" class="material-icons animate-spin text-[20px]">autorenew</span>
              <span *ngIf="!loading" class="material-icons text-[20px]">save</span>
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  form: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.api.getMe().subscribe({
      next: (data) => {
        this.profile = data;
        this.form.patchValue({
          full_name: data.full_name,
          phone: data.phone
        });
      }
    });
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    
    this.api.updateProfile(this.form.value).subscribe({
      next: (data) => {
        this.profile = { ...this.profile, ...data };
        this.loading = false;
        this.successMsg = 'Data profil Anda berhasil diperbarui.';
        setTimeout(() => this.successMsg = '', 5000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Terjadi kesalahan saat menyimpan data.';
      }
    });
  }

  getInitials(): string {
    if (!this.profile?.full_name) return 'U';
    const parts = this.profile.full_name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  uploadedAvatarUrl: string | null = null;
  
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedAvatarUrl = e.target.result;
        this.successMsg = 'Foto profil berhasil diperbarui.';
        setTimeout(() => this.successMsg = '', 3000);
      };
      reader.readAsDataURL(file);
    }
  }
}
