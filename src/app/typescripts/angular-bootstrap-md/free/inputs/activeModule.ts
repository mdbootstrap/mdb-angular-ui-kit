import { NgModule, ModuleWithProviders  } from '@angular/core';
import { ActiveDirective } from './activeClass';
import { EqualValidator } from './equalValidatorDirective';
import { InputValidateDirective } from './InputValidateDirective';

@NgModule({
    declarations: [ActiveDirective, EqualValidator, InputValidateDirective],
    exports: [ActiveDirective, EqualValidator, InputValidateDirective]
})

export class activeModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: activeModule, providers: []};
  }
}