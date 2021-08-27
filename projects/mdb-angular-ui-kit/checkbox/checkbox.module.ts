import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MdbCheckboxDirective } from './checkbox.directive';

@NgModule({
  declarations: [MdbCheckboxDirective],
  exports: [MdbCheckboxDirective],
  imports: [CommonModule, FormsModule],
})
export class MdbCheckboxModule {}
