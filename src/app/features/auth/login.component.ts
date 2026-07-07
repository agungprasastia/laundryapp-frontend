import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent/30 py-12 px-6 relative overflow-hidden font-sans">
      <!-- Decorative background elements -->
      <div class="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -top-40 -left-20 animate-pulse"></div>
      <div class="absolute w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style="animation-delay: 2s"></div>

      <div class="w-full max-w-md relative z-10">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 animate-slideInUp">
          <div class="text-center mb-10">
            <div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-105">
              <span class="material-icons text-5xl text-primary">local_laundry_service</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 font-serif mb-2">Masuk</h1>
            <p class="text-slate-500 text-sm">Selamat datang kembali di Laundry Kinclong</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="login()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3.5 text-slate-400 text-sm">email</span>
                <input id="email" type="email" formControlName="email" placeholder="email@contoh.com" 
                       class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
              <small *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-red-500 text-xs mt-1 block pl-2">Email wajib diisi dengan format yang benar</small>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" class="text-xs text-primary font-medium hover:underline">Lupa password?</a>
              </div>
              <div class="relative">
                <span class="material-icons absolute left-4 top-3.5 text-slate-400 text-sm">lock</span>
                <input id="password" type="password" formControlName="password" placeholder="••••••••" 
                       class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
              </div>
              <small *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="text-red-500 text-xs mt-1 block pl-2">Password minimal 6 karakter</small>
            </div>

            <div *ngIf="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <span class="material-icons text-sm">error_outline</span> {{ error }}
            </div>

            <button type="submit" [disabled]="form.invalid || loading" 
                    class="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="loading" class="material-icons animate-spin text-sm">refresh</span>
              {{ loading ? 'Memproses...' : 'Masuk Sekarang' }}
            </button>
          </form>

          <p class="text-center mt-8 text-sm text-slate-500">
            Belum punya akun? <a routerLink="/register" class="text-primary font-bold hover:underline">Daftar di sini</a>
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
export class LoginComponent {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  error = '';
  loading = false;

  async login() {
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    const { error } = await this.auth.signIn(email!, password!);
    if (error) {
      this.error = 'Email atau password salah';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    
    // Redirect based on role, explicitly entering NgZone after native await
    try {
      const profile = await firstValueFrom(this.api.getMe());
      this.zone.run(() => {
        this.router.navigate([profile.role === 'admin' ? '/admin' : '/user']);
      });
    } catch {
      this.zone.run(() => {
        this.router.navigate(['/']);
      });
    }
    this.loading = false;
    this.cdr.detectChanges();
  }
}
