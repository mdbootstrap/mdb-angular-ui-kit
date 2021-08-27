import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MdbRangeComponent } from './range.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MdbRangeComponent],
  exports: [MdbRangeComponent],
})
export class MdbRangeModule {}
