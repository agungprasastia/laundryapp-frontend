import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="material-icons logo-icon">local_laundry_service</span>
          <h1>Daftar</h1>
          <p>Buat akun baru di Laundry Kinclong</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="register()">
          <div class="field">
            <label for="full_name">Nama Lengkap</label>
            <input id="full_name" formControlName="full_name" placeholder="Nama lengkap" />
            <small *ngIf="form.get('full_name')?.touched && form.get('full_name')?.invalid">Nama wajib diisi</small>
          </div>
          <div class="field">
            <label for="phone">Nomor HP</label>
            <input id="phone" formControlName="phone" placeholder="08xxxxxxxxxx" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="email@contoh.com" />
            <small *ngIf="form.get('email')?.touched && form.get('email')?.invalid">Email tidak valid</small>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="Minimal 6 karakter" />
            <small *ngIf="form.get('password')?.touched && form.get('password')?.invalid">Password minimal 6 karakter</small>
          </div>
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <div *ngIf="success" class="success-msg">{{ success }}</div>
          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Memproses...' : 'Daftar' }}
          </button>
        </form>
        <p class="switch-link">Sudah punya akun? <a routerLink="/login">Masuk</a></p>
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
    .field { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    input {
      width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px;
      font-size: 15px; outline: none; transition: border-color 0.2s; box-sizing: border-box;
    }
    input:focus { border-color: #0d9488; }
    small { color: #dc2626; font-size: 12px; }
    .error-msg { color: #dc2626; font-size: 13px; margin-bottom: 12px; text-align: center; }
    .success-msg { color: #059669; font-size: 13px; margin-bottom: 12px; text-align: center; }
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
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

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
    if (error) {
      this.error = error.message || 'Gagal mendaftar';
      this.loading = false;
      return;
    }
    this.success = 'Berhasil mendaftar! Cek email untuk verifikasi, lalu login.';
    this.loading = false;
  }
}
