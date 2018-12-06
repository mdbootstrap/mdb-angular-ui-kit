import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbErrorDirective } from './error.directive';
import { MdbSuccessDirective } from './success.directive';
import { MdbValidateDirective } from './validate.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MdbErrorDirective, MdbSuccessDirective, MdbValidateDirective],
  exports: [MdbErrorDirective, MdbSuccessDirective, MdbValidateDirective],
})
export class InputUtilitiesModule {}
