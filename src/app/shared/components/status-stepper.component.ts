import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-start w-full relative z-10 px-2 mt-4">
      <div *ngFor="let step of steps; let i = index" 
           class="flex flex-col items-center relative flex-1 group"
           [class.text-primary]="i <= currentIndex"
           [class.text-slate-400]="i > currentIndex">
        
        <!-- Icon Node -->
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 shadow-sm border-2"
             [ngClass]="{
               'bg-primary text-white border-primary shadow-primary/30': i < currentIndex,
               'bg-white text-primary border-primary shadow-primary/20 scale-110 ring-4 ring-primary/10': i === currentIndex,
               'bg-white border-slate-200 text-slate-300': i > currentIndex
             }">
          <span class="material-icons" [ngClass]="{'text-[24px]': i === currentIndex, 'text-[20px]': i !== currentIndex}">
             {{ getIcon(step) }}
          </span>
          <!-- Pulsing dot for active state -->
          <span *ngIf="i === currentIndex" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-white"></span>
          </span>
        </div>
        
        <!-- Label -->
        <span class="text-xs font-semibold mt-3 text-center transition-colors duration-300 whitespace-nowrap"
              [ngClass]="{'text-primary font-bold': i === currentIndex}">
          {{ step }}
        </span>
        
        <!-- Connecting Line -->
        <div *ngIf="i < steps.length - 1" 
             class="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-[3px] z-0 transition-colors duration-500"
             [ngClass]="i < currentIndex ? 'bg-primary' : 'bg-slate-200'">
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StatusStepperComponent {
  @Input() status: string = 'Baru';
  steps = ['Baru', 'Proses', 'Selesai', 'Diambil'];

  get currentIndex(): number {
    return this.steps.indexOf(this.status);
  }

  getIcon(step: string): string {
    switch(step) {
      case 'Baru': return 'fiber_new';
      case 'Proses': return 'local_laundry_service';
      case 'Selesai': return 'check_circle';
      case 'Diambil': return 'done_all';
      default: return 'radio_button_unchecked';
    }
  }
}
