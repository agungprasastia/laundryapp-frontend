import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [style.border-left-color]="color" [style.--glow-color]="color + '40'">
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
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    .card:hover { 
      transform: translateY(-4px) scale(1.02); 
      box-shadow: 0 10px 25px -5px var(--glow-color, rgba(0,0,0,0.1)); 
    }
    .card:hover .icon-wrap .material-icons {
      transform: scale(1.1) rotate(5deg);
    }
    .icon-wrap {
      width: 48px; height: 48px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    .icon-wrap .material-icons { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
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
