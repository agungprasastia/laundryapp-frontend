import { Component, inject } from '@angular/core';
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
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="material-icons logo-icon">local_laundry_service</span>
          <h1>Masuk</h1>
          <p>Selamat datang kembali di Laundry Kinclong</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="login()">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="email@contoh.com" />
            <small *ngIf="form.get('email')?.touched && form.get('email')?.invalid">Email wajib diisi</small>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••" />
            <small *ngIf="form.get('password')?.touched && form.get('password')?.invalid">Password minimal 6 karakter</small>
          </div>
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
        <p class="switch-link">Belum punya akun? <a routerLink="/register">Daftar</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f0fdfa, #e0f2fe); padding: 20px;
    }
    .auth-card {
      background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .logo-icon { font-size: 48px; color: #0d9488; }
    h1 { font-size: 24px; font-weight: 700; margin: 12px 0 4px; color: #0f172a; }
    .auth-header p { color: #64748b; font-size: 14px; }
    .field { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    input {
      width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px;
      font-size: 15px; outline: none; transition: border-color 0.2s; box-sizing: border-box;
    }
    input:focus { border-color: #0d9488; }
    small { color: #dc2626; font-size: 12px; }
    .error-msg { color: #dc2626; font-size: 13px; margin-bottom: 12px; text-align: center; }
    button {
      width: 100%; padding: 12px; background: #0d9488; color: white; border: none;
      border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    button:hover { background: #0f766e; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .switch-link { text-align: center; margin-top: 20px; font-size: 14px; color: #64748b; }
    .switch-link a { color: #0d9488; font-weight: 600; text-decoration: none; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

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
      return;
    }
    // Redirect based on role
    try {
      const profile = await firstValueFrom(this.api.getMe());
      this.router.navigate([profile.role === 'admin' ? '/admin' : '/user']);
    } catch {
      this.router.navigate(['/']);
    }
    this.loading = false;
  }
}
