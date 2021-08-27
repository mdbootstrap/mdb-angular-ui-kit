import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MdbFormControlComponent } from './form-control.component';
import { MdbInputDirective } from './input.directive';
import { MdbLabelDirective } from './label.directive';

@NgModule({
  declarations: [MdbFormControlComponent, MdbInputDirective, MdbLabelDirective],
  exports: [MdbFormControlComponent, MdbInputDirective, MdbLabelDirective],
  imports: [CommonModule, FormsModule],
})
export class MdbFormsModule {}
