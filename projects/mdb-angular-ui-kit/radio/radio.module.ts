import { MdbRadioDirective } from './radio-button.directive';
import { MdbRadioGroupDirective } from './radio-group.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MdbRadioDirective, MdbRadioGroupDirective],
  exports: [MdbRadioDirective, MdbRadioGroupDirective],
  imports: [CommonModule, FormsModule],
})
export class MdbRadioModule {}
