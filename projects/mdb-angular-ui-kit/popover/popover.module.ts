import { MdbPopoverDirective } from './popover.directive';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MdbPopoverComponent } from './popover.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MdbPopoverDirective, MdbPopoverComponent],
  exports: [MdbPopoverDirective, MdbPopoverComponent],
})
export class MdbPopoverModule {}
