import { MdbDropdownDirective } from './dropdown.directive';
import { MdbDropdownToggleDirective } from './dropdown-toggle.directive';
import { MdbDropdownMenuDirective } from './dropdown-menu.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MdbDropdownDirective, MdbDropdownToggleDirective, MdbDropdownMenuDirective],
  exports: [MdbDropdownDirective, MdbDropdownToggleDirective, MdbDropdownMenuDirective],
})
export class MdbDropdownModule {}
