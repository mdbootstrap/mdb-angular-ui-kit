import { MdbBtnDirective } from './buttons.directive';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonCheckboxDirective } from './checkbox.directive';
import { ButtonRadioDirective } from './radio.directive';

@NgModule({
  declarations: [ButtonCheckboxDirective, ButtonRadioDirective, MdbBtnDirective],
  exports: [ButtonCheckboxDirective, ButtonRadioDirective, MdbBtnDirective]
})
export class ButtonsModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ButtonsModule, providers: []};
  }
}
