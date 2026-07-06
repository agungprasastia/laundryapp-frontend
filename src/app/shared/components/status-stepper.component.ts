import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stepper">
      <div *ngFor="let step of steps; let i = index" class="step" [class.active]="i <= currentIndex" [class.current]="i === currentIndex">
        <div class="dot">{{ i + 1 }}</div>
        <span class="label">{{ step }}</span>
        <div *ngIf="i < steps.length - 1" class="line" [class.active]="i < currentIndex"></div>
      </div>
    </div>
  `,
  styles: [`
    .stepper { display: flex; align-items: flex-start; gap: 0; width: 100%; }
    .step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; }
    .dot {
      width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 14px; border: 2px solid #d1d5db; color: #9ca3af; background: white; z-index: 1;
      transition: all 0.3s;
    }
    .step.active .dot { border-color: #0d9488; background: #0d9488; color: white; }
    .step.current .dot { border-color: #0d9488; background: #ccfbf1; color: #0d9488; box-shadow: 0 0 0 4px rgba(13,148,136,0.15); }
    .label { font-size: 12px; margin-top: 6px; color: #6b7280; text-align: center; }
    .step.active .label { color: #0d9488; font-weight: 600; }
    .line {
      position: absolute; top: 18px; left: calc(50% + 18px); right: calc(-50% + 18px);
      height: 2px; background: #d1d5db; z-index: 0;
    }
    .line.active { background: #0d9488; }
  `]
})
export class StatusStepperComponent {
  @Input() status: string = 'Baru';
  steps = ['Baru', 'Proses', 'Selesai', 'Diambil'];

  get currentIndex(): number {
    return this.steps.indexOf(this.status);
  }
}
