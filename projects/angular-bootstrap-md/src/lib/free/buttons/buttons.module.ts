import { MdbBtnDirective } from './buttons.directive';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonCheckboxDirective } from './checkbox.directive';
import { ButtonRadioDirective } from './radio.directive';
import { FixedButtonCaptionDirective } from './fixed-caption.directive';

@NgModule({
  declarations: [
    ButtonCheckboxDirective,
    ButtonRadioDirective,
    MdbBtnDirective,
    FixedButtonCaptionDirective,
  ],
  exports: [
    ButtonCheckboxDirective,
    ButtonRadioDirective,
    MdbBtnDirective,
    FixedButtonCaptionDirective,
  ],
})
export class ButtonsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: ButtonsModule, providers: [] };
  }
}
