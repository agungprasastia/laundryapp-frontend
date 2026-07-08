import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, timeout, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  
  private profileSubject = new BehaviorSubject<any>(null);
  profileState$ = this.profileSubject.asObservable();

  updateProfileState(profile: any) {
    this.profileSubject.next(profile);
  }

  constructor(private http: HttpClient) {}

  // Public
  getPakets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/pakets`);
  }

  cekStatus(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/cek-status`, { params: { query } });
  }

  // Auth
  getMe(): Observable<any> {
    return this.http.get(`${this.base}/me`).pipe(
      tap(data => this.updateProfileState(data))
    );
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.base}/user/profile`, data);
  }

  // User
  getUserDashboard(): Observable<any> {
    return this.http.get(`${this.base}/user/dashboard`);
  }

  createPesanan(data: { paket_id: number; catatan?: string }): Observable<any> {
    return this.http.post(`${this.base}/user/pesan`, data);
  }

  getPesanan(id: number): Observable<any> {
    return this.http.get(`${this.base}/user/pesanan/${id}`);
  }

  uploadBuktiBayar(id: number, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('bukti_bayar', file);
    return this.http.post(`${this.base}/user/bayar/${id}`, fd);
  }

  addRating(id: number, data: any): Observable<any> {
    return this.http.post(`${this.base}/user/pesanan/${id}/rating`, data);
  }

  // Admin
  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.base}/admin/dashboard`).pipe(timeout(15000));
  }

  getAdminCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/customers`);
  }

  getAdminUlasan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/ulasan`);
  }

  getAdminPakets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/pakets`);
  }

  createPaket(data: FormData): Observable<any> {
    return this.http.post(`${this.base}/admin/pakets`, data);
  }

  updatePaket(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.base}/admin/pakets/${id}`, data);
  }

  deletePaket(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/pakets/${id}`);
  }

  getAdminPesanan(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/pesanan`, { params });
  }

  updatePesanan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/admin/pesanan/${id}`, data);
  }

  deletePesanan(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/pesanan/${id}`);
  }

  getLaporan(params?: any): Observable<any> {
    return this.http.get(`${this.base}/admin/laporan`, { params });
  }

  getBuktiBayarUrl(path: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.base}/admin/bukti-bayar/${path}`);
  }
}
