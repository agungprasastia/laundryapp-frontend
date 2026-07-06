import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [style.border-left-color]="color">
      <div class="icon-wrap" [style.background]="color + '15'" [style.color]="color">
        <span class="material-icons">{{ icon }}</span>
      </div>
      <div class="info">
        <span class="label">{{ label }}</span>
        <span class="value">{{ value }}</span>
      </div>
    </div>
  `,
  styles: [`
    .card {
      display: flex; align-items: center; gap: 16px; padding: 20px; background: white;
      border-radius: 12px; border-left: 4px solid; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .icon-wrap {
      width: 48px; height: 48px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    .info { display: flex; flex-direction: column; }
    .label { font-size: 13px; color: #6b7280; font-weight: 500; }
    .value { font-size: 24px; font-weight: 700; color: #111827; margin-top: 2px; }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() icon = 'info';
  @Input() color = '#0d9488';
}
