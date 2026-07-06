# LaundryApp Frontend

Aplikasi frontend untuk sistem manajemen Laundry, dibangun dengan Angular.

## Prerequisites

- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)

## Setup & Instalasi

1. Clone repositori ini.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy template environment:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```
4. Sesuaikan `supabaseUrl` dan `supabaseAnonKey` di file `environment.ts` dengan data dari Supabase Dashboard.

## Menjalankan Aplikasi

Jalankan server development:

```bash
ng serve
```

Buka `http://localhost:4200/` di browser. Aplikasi otomatis reload jika ada perubahan kode.

## Build untuk Production

```bash
ng build
```

Hasil build akan ada di folder `dist/`.

## Fitur

- Autentikasi User (Supabase Auth)
- Dashboard Admin & Pelanggan
- Manajemen Paket Laundry
- Manajemen Pesanan
- Upload Bukti Pembayaran
