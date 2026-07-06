import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent/30 py-12 px-6 relative overflow-hidden font-sans">
      <!-- Decorative background elements -->
      <div class="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -top-40 -left-20 animate-pulse"></div>
      <div class="absolute w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style="animation-delay: 2s"></div>

      <div class="w-full max-w-md relative z-10">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 animate-slideInUp">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-105">
              <span class="material-icons text-4xl text-primary">person_add</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 font-serif mb-2">Daftar</h1>
            <p class="text-slate-500 text-sm">Buat akun baru di Laundry Kinclong</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="register()" class="space-y-5">
            <div>
              <label for="full_name" class="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-sm">badge</span>
                <input id="full_name" formControlName="full_name" placeholder="Nama lengkap Anda" 
                       class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
              <small *ngIf="form.get('full_name')?.touched && form.get('full_name')?.invalid" class="text-red-500 text-xs mt-1 block pl-2">Nama wajib diisi</small>
            </div>

            <div>
              <label for="phone" class="block text-sm font-semibold text-slate-700 mb-1">Nomor HP</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-sm">phone_iphone</span>
                <input id="phone" formControlName="phone" placeholder="08xxxxxxxxxx" 
                       class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-sm">email</span>
                <input id="email" type="email" formControlName="email" placeholder="email@contoh.com" 
                       class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
              <small *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-red-500 text-xs mt-1 block pl-2">Email tidak valid</small>
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3 text-slate-400 text-sm">lock</span>
                <input id="password" type="password" formControlName="password" placeholder="Minimal 6 karakter" 
                       class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
              <small *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="text-red-500 text-xs mt-1 block pl-2">Password minimal 6 karakter</small>
            </div>

            <div *ngIf="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <span class="material-icons text-sm">error_outline</span> {{ error }}
            </div>
            <div *ngIf="success" class="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-medium border border-emerald-100 flex items-start gap-2">
              <span class="material-icons text-sm mt-0.5">check_circle</span> 
              <span>{{ success }}</span>
            </div>

            <button type="submit" [disabled]="form.invalid || loading" 
                    class="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3.5 px-4 mt-2 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="loading" class="material-icons animate-spin text-sm">refresh</span>
              {{ loading ? 'Memproses...' : 'Daftar Sekarang' }}
            </button>
          </form>

          <p class="text-center mt-6 text-sm text-slate-500">
            Sudah punya akun? <a routerLink="/login" class="text-primary font-bold hover:underline">Masuk di sini</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideInUp {
      animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private zone = inject(NgZone);

  form = this.fb.group({
    full_name: ['', Validators.required],
    phone: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  error = '';
  success = '';
  loading = false;

  async register() {
    this.loading = true;
    this.error = '';
    this.success = '';
    const { email, password, full_name, phone } = this.form.value;
    const { error } = await this.auth.signUp(email!, password!, {
      full_name: full_name!,
      phone: phone || undefined,
    });
    
    this.zone.run(() => {
      if (error) {
        this.error = error.message || 'Gagal mendaftar';
        this.loading = false;
        return;
      }
      this.success = 'Berhasil mendaftar! Cek email untuk verifikasi, lalu login.';
      this.loading = false;
    });
  }
}
