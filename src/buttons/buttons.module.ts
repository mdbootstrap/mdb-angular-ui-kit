import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonCheckboxDirective } from './checkbox.directive';
import { ButtonRadioDirective } from './radio.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ButtonCheckboxDirective, ButtonRadioDirective],
  imports: [CommonModule],
  exports: [ButtonCheckboxDirective, ButtonRadioDirective]
})
export class ButtonsModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ButtonsModule, providers: []};
  }
}
