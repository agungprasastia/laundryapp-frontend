import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="badgeClass">{{ text }}</span>`,
  styles: [`
    .badge {
      display: inline-block; padding: 4px 12px; border-radius: 9999px;
      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .badge-baru { background: #dbeafe; color: #1e40af; }
    .badge-proses { background: #fef3c7; color: #92400e; }
    .badge-selesai { background: #d1fae5; color: #065f46; }
    .badge-diambil { background: #e0e7ff; color: #3730a3; }
    .badge-belum { background: #fee2e2; color: #991b1b; }
    .badge-verifikasi { background: #fef3c7; color: #92400e; }
    .badge-lunas { background: #d1fae5; color: #065f46; }
  `]
})
export class StatusBadgeComponent {
  @Input() text: string = '';
  @Input() type: 'status' | 'bayar' = 'status';

  get badgeClass(): string {
    const map: Record<string, string> = {
      'Baru': 'badge-baru',
      'Proses': 'badge-proses',
      'Selesai': 'badge-selesai',
      'Diambil': 'badge-diambil',
      'Belum Lunas': 'badge-belum',
      'Menunggu Verifikasi': 'badge-verifikasi',
      'Lunas': 'badge-lunas',
    };
    return map[this.text] || '';
  }
}
