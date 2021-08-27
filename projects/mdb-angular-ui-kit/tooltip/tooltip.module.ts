import { MdbTooltipDirective } from './tooltip.directive';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MdbTooltipComponent } from './tooltip.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MdbTooltipDirective, MdbTooltipComponent],
  exports: [MdbTooltipDirective, MdbTooltipComponent],
})
export class MdbTooltipModule {}
