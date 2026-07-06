import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Laundry <span class="accent">Kinclong</span></h1>
          <p class="tagline">Cucian bersih, wangi, dan rapi — tanpa repot.</p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary">Daftar Sekarang</a>
            <a routerLink="/cek-status" class="btn btn-outline">Cek Status Pesanan</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="bubble b1"></div>
          <div class="bubble b2"></div>
          <div class="bubble b3"></div>
          <span class="material-icons hero-icon">local_laundry_service</span>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <h2>Kenapa Pilih Kami?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <span class="material-icons">speed</span>
            <h3>Cepat</h3>
            <p>Layanan express siap dalam hitungan jam</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">verified</span>
            <h3>Terpercaya</h3>
            <p>Ribuan pelanggan puas dengan hasil cucian kami</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">payments</span>
            <h3>Terjangkau</h3>
            <p>Harga bersahabat dengan kualitas premium</p>
          </div>
        </div>
      </section>

      <!-- Pakets -->
      <section class="pakets-section" *ngIf="pakets.length">
        <h2>Paket Layanan</h2>
        <div class="paket-grid">
          <div class="paket-card" *ngFor="let p of pakets">
            <img *ngIf="p.foto_url" [src]="p.foto_url" [alt]="p.nama_paket" class="paket-img"/>
            <div *ngIf="!p.foto_url" class="paket-img-placeholder">
              <span class="material-icons">dry_cleaning</span>
            </div>
            <div class="paket-info">
              <h3>{{ p.nama_paket }}</h3>
              <p class="price">Rp {{ p.harga | number:'1.0-0' }} <small>/kg</small></p>
              <p class="est" *ngIf="p.estimasi">⏱ {{ p.estimasi }}</p>
              <p class="desc" *ngIf="p.deskripsi">{{ p.deskripsi }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta">
        <h2>Siap mencuci?</h2>
        <p>Daftar sekarang dan nikmati kemudahan laundry online.</p>
        <a routerLink="/register" class="btn btn-primary btn-lg">Mulai Sekarang</a>
      </section>
    </div>
  `,
  styles: [`
    .landing { font-family: 'Inter', sans-serif; }
    .hero {
      display: flex; align-items: center; justify-content: space-between;
      padding: 80px 5vw 60px; background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
      min-height: 70vh; gap: 40px; flex-wrap: wrap;
    }
    .hero-content { max-width: 520px; }
    .hero h1 { font-size: 48px; font-weight: 800; color: #0f172a; margin: 0 0 16px; }
    .accent { color: #0d9488; }
    .tagline { font-size: 20px; color: #475569; margin-bottom: 32px; line-height: 1.6; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

    .btn {
      display: inline-flex; align-items: center; padding: 12px 28px; border-radius: 10px;
      font-weight: 600; font-size: 15px; text-decoration: none; transition: all 0.2s; border: 2px solid transparent;
    }
    .btn-primary { background: #0d9488; color: white; }
    .btn-primary:hover { background: #0f766e; transform: translateY(-1px); }
    .btn-outline { border-color: #0d9488; color: #0d9488; background: white; }
    .btn-outline:hover { background: #f0fdfa; }
    .btn-lg { padding: 14px 36px; font-size: 16px; }

    .hero-visual {
      position: relative; width: 280px; height: 280px; display: flex;
      align-items: center; justify-content: center;
    }
    .hero-icon { font-size: 120px; color: #0d9488; opacity: 0.9; }
    .bubble {
      position: absolute; border-radius: 50%; background: rgba(13,148,136,0.12);
      animation: float 6s ease-in-out infinite;
    }
    .b1 { width: 80px; height: 80px; top: 0; left: 10px; animation-delay: 0s; }
    .b2 { width: 50px; height: 50px; bottom: 20px; right: 0; animation-delay: 2s; }
    .b3 { width: 35px; height: 35px; top: 40px; right: 30px; animation-delay: 4s; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    .features, .pakets-section, .cta { padding: 60px 5vw; }
    .features { background: white; }
    h2 { font-size: 32px; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 40px; }
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
    .feature-card {
      text-align: center; padding: 32px 24px; border-radius: 16px;
      background: #f8fafc; border: 1px solid #e2e8f0; transition: transform 0.2s;
    }
    .feature-card:hover { transform: translateY(-4px); }
    .feature-card .material-icons { font-size: 48px; color: #0d9488; margin-bottom: 12px; }
    .feature-card h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .feature-card p { color: #64748b; font-size: 14px; margin: 0; line-height: 1.6; }

    .pakets-section { background: #f8fafc; }
    .paket-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .paket-card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .paket-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .paket-img { width: 100%; height: 180px; object-fit: cover; }
    .paket-img-placeholder {
      width: 100%; height: 180px; background: linear-gradient(135deg, #ccfbf1, #e0f2fe);
      display: flex; align-items: center; justify-content: center;
    }
    .paket-img-placeholder .material-icons { font-size: 64px; color: #0d9488; opacity: 0.5; }
    .paket-info { padding: 20px; }
    .paket-info h3 { font-size: 18px; font-weight: 700; margin: 0 0 8px; color: #0f172a; }
    .price { font-size: 22px; font-weight: 700; color: #0d9488; margin: 0 0 6px; }
    .price small { font-size: 14px; font-weight: 400; color: #94a3b8; }
    .est { font-size: 13px; color: #64748b; margin: 4px 0; }
    .desc { font-size: 13px; color: #94a3b8; margin: 8px 0 0; }

    .cta {
      text-align: center; background: linear-gradient(135deg, #0d9488, #0891b2);
      color: white; border-radius: 0;
    }
    .cta h2 { color: white; }
    .cta p { font-size: 16px; opacity: 0.9; margin-bottom: 24px; }
    .cta .btn-primary { background: white; color: #0d9488; }
    .cta .btn-primary:hover { background: #f0fdfa; }

    @media (max-width: 768px) {
      .hero { padding: 40px 5vw; text-align: center; justify-content: center; }
      .hero h1 { font-size: 32px; }
      .hero-actions { justify-content: center; }
      .hero-visual { width: 200px; height: 200px; }
      .hero-icon { font-size: 80px; }
    }
  `]
})
export class LandingComponent implements OnInit {
  pakets: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPakets().subscribe(data => this.pakets = data);
  }
}
